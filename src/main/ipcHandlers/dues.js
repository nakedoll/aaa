import { ipcMain } from 'electron'

function validateDuesData(data, { requireYear = true } = {}) {
  if (requireYear) {
    const year = Number(data.year)
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      return '연도는 2000~2100 사이의 정수여야 합니다.'
    }
  }

  const amount = Number(data.amount)
  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0) {
    return '금액은 1 이상의 정수여야 합니다.'
  }

  if (!data.paid_at || !/^\d{4}-\d{2}-\d{2}$/.test(String(data.paid_at))) {
    return '납부일 형식이 올바르지 않습니다. (YYYY-MM-DD)'
  }
  const [py, pm, pd] = String(data.paid_at).split('-').map(Number)
  const pdt = new Date(py, pm - 1, pd)
  if (pdt.getFullYear() !== py || pdt.getMonth() + 1 !== pm || pdt.getDate() !== pd) {
    return '납부일이 존재하지 않는 날짜입니다.'
  }

  return null
}

export default function registerDuesHandlers(db) {
  ipcMain.handle('dues:list', (_e, memberId) => {
    try {
      const rows = db.prepare('SELECT * FROM dues WHERE member_id = ? ORDER BY year DESC').all(memberId)
      return { ok: true, data: rows }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })

  ipcMain.handle('dues:create', (_e, data) => {
    try {
      const member = db.prepare('SELECT status FROM members WHERE id = ?').get(data.member_id)
      if (!member) return { ok: false, error: '회원을 찾을 수 없습니다.' }
      if (member.status === 'withdrawn') {
        return { ok: false, error: '탈퇴 회원의 회비는 변경할 수 없습니다.' }
      }

      const validErr = validateDuesData(data, { requireYear: true })
      if (validErr) return { ok: false, error: validErr }

      const result = db.prepare(`
        INSERT INTO dues (member_id, year, amount, paid_at)
        VALUES (@member_id, @year, @amount, @paid_at)
      `).run({
        member_id: data.member_id,
        year:      Number(data.year),
        amount:    Number(data.amount),
        paid_at:   data.paid_at
      })
      return { ok: true, data: { id: result.lastInsertRowid } }
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        return { ok: false, error: '해당 연도의 납부 내역이 이미 존재합니다.' }
      }
      return { ok: false, error: err.message }
    }
  })

  ipcMain.handle('dues:update', (_e, id, data) => {
    try {
      const due = db.prepare(`
        SELECT d.id, m.status AS member_status
        FROM dues d JOIN members m ON m.id = d.member_id WHERE d.id = ?
      `).get(id)
      if (!due) return { ok: false, error: '납부 내역을 찾을 수 없습니다.' }
      if (due.member_status === 'withdrawn') {
        return { ok: false, error: '탈퇴 회원의 회비는 변경할 수 없습니다.' }
      }

      const validErr = validateDuesData(data, { requireYear: false })
      if (validErr) return { ok: false, error: validErr }

      db.prepare(`
        UPDATE dues SET amount = @amount, paid_at = @paid_at, updated_at = datetime('now','localtime') WHERE id = @id
      `).run({ id, amount: Number(data.amount), paid_at: data.paid_at })
      return { ok: true, data: null }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })
}
