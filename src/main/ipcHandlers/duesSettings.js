import { ipcMain } from 'electron'

function validateSettingsData(data) {
  const year = Number(data.year)
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return '연도는 2000~2100 사이의 정수여야 합니다.'
  }

  const amount = Number(data.base_amount)
  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0) {
    return '기준 회비는 1 이상의 정수여야 합니다.'
  }

  return null
}

export default function registerDuesSettingsHandlers(db) {
  ipcMain.handle('dues_settings:list', () => {
    try {
      const rows = db.prepare('SELECT * FROM dues_settings ORDER BY year DESC').all()
      return { ok: true, data: rows }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })

  ipcMain.handle('dues_settings:upsert', (_e, data) => {
    try {
      const validErr = validateSettingsData(data)
      if (validErr) return { ok: false, error: validErr }

      db.prepare(`
        INSERT INTO dues_settings (year, base_amount)
        VALUES (@year, @base_amount)
        ON CONFLICT(year) DO UPDATE SET
          base_amount = @base_amount,
          updated_at  = datetime('now','localtime')
      `).run({ year: Number(data.year), base_amount: Number(data.base_amount) })
      return { ok: true, data: null }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })
}
