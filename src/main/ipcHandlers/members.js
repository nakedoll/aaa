import { ipcMain } from 'electron'

function localDateStr() {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function validateMemberData(data) {
  const company = (data.company_name ?? '').trim()
  if (!company)          return '회사명은 필수입니다.'
  if (company.length > 100) return '회사명은 최대 100자까지 입력 가능합니다.'

  const ceo = (data.ceo_name ?? '').trim()
  if (!ceo) return '대표자 이름은 필수입니다.'

  if (!data.joined_at || !/^\d{4}-\d{2}-\d{2}$/.test(data.joined_at)) {
    return '가입일 형식이 올바르지 않습니다. (YYYY-MM-DD)'
  }
  const [jy, jm, jd] = data.joined_at.split('-').map(Number)
  const jdt = new Date(jy, jm - 1, jd)
  if (jdt.getFullYear() !== jy || jdt.getMonth() + 1 !== jm || jdt.getDate() !== jd) {
    return '가입일이 존재하지 않는 날짜입니다.'
  }
  if (data.joined_at > localDateStr()) return '가입일은 미래 날짜일 수 없습니다.'

  if (data.contact_phone) {
    if (!/^[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}$/.test(data.contact_phone)) {
      return '연락처 형식이 올바르지 않습니다. (예: 02-1234-5678)'
    }
  }

  if (data.contact_email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact_email)) {
      return '이메일 형식이 올바르지 않습니다.'
    }
  }

  return null
}

export default function registerMembersHandlers(db) {
  ipcMain.handle('members:list', () => {
    try {
      const year = new Date().getFullYear()
      const rows = db.prepare(`
        SELECT
          m.*,
          CASE
            WHEN d.id IS NOT NULL THEN 'paid'
            WHEN ds.year IS NOT NULL THEN 'unpaid'
            ELSE 'not_configured'
          END AS currentYearDuesStatus
        FROM members m
        LEFT JOIN dues d ON d.member_id = m.id AND d.year = ?
        LEFT JOIN dues_settings ds ON ds.year = ?
        ORDER BY m.company_name ASC
      `).all(year, year)
      return { ok: true, data: rows }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })

  ipcMain.handle('members:get', (_e, id) => {
    try {
      const member = db.prepare('SELECT * FROM members WHERE id = ?').get(id)
      if (!member) return { ok: false, error: '회원을 찾을 수 없습니다.' }
      return { ok: true, data: member }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })

  ipcMain.handle('members:create', (_e, data) => {
    try {
      if (data.status === 'withdrawn') {
        return { ok: false, error: 'withdrawn은 members:withdraw 채널을 통해서만 처리할 수 있습니다.' }
      }
      const validErr = validateMemberData(data)
      if (validErr) return { ok: false, error: validErr }

      const result = db.prepare(`
        INSERT INTO members (company_name, ceo_name, contact_name, contact_phone, contact_email, joined_at, status, memo)
        VALUES (@company_name, @ceo_name, @contact_name, @contact_phone, @contact_email, @joined_at, @status, @memo)
      `).run({
        company_name:  data.company_name.trim(),
        ceo_name:      data.ceo_name.trim(),
        contact_name:  data.contact_name  || null,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        joined_at:     data.joined_at,
        status:        data.status || 'active',
        memo:          data.memo   || null
      })
      return { ok: true, data: { id: result.lastInsertRowid } }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })

  ipcMain.handle('members:update', (_e, id, data) => {
    try {
      if (data.status === 'withdrawn') {
        return { ok: false, error: 'withdrawn은 members:withdraw 채널을 통해서만 처리할 수 있습니다.' }
      }
      const existing = db.prepare('SELECT status FROM members WHERE id = ?').get(id)
      if (!existing) return { ok: false, error: '회원을 찾을 수 없습니다.' }
      if (existing.status === 'withdrawn') {
        return { ok: false, error: '탈퇴 회원은 수정할 수 없습니다.' }
      }
      const validErr = validateMemberData(data)
      if (validErr) return { ok: false, error: validErr }

      db.prepare(`
        UPDATE members
        SET company_name  = @company_name,
            ceo_name      = @ceo_name,
            contact_name  = @contact_name,
            contact_phone = @contact_phone,
            contact_email = @contact_email,
            joined_at     = @joined_at,
            status        = @status,
            memo          = @memo,
            updated_at    = datetime('now','localtime')
        WHERE id = @id
      `).run({
        id,
        company_name:  data.company_name.trim(),
        ceo_name:      data.ceo_name.trim(),
        contact_name:  data.contact_name  || null,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        joined_at:     data.joined_at,
        status:        data.status,
        memo:          data.memo || null
      })
      return { ok: true, data: null }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })

  ipcMain.handle('members:withdraw', (_e, id) => {
    try {
      const existing = db.prepare('SELECT status FROM members WHERE id = ?').get(id)
      if (!existing) return { ok: false, error: '회원을 찾을 수 없습니다.' }
      if (existing.status === 'withdrawn') return { ok: true, data: null } // 멱등 처리
      db.prepare(`UPDATE members SET status = 'withdrawn', updated_at = datetime('now','localtime') WHERE id = ?`).run(id)
      return { ok: true, data: null }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })
}
