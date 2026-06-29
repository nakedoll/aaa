import { ipcMain } from 'electron'

export default function registerStatsHandlers(db) {
  ipcMain.handle('stats:dashboard', () => {
    try {
      const year = new Date().getFullYear()

      const counts = db.prepare(`
        SELECT
          COUNT(*) AS totalMembers,
          SUM(CASE WHEN status = 'active'    THEN 1 ELSE 0 END) AS activeMembers,
          SUM(CASE WHEN status = 'dormant'   THEN 1 ELSE 0 END) AS dormantMembers,
          SUM(CASE WHEN status = 'withdrawn' THEN 1 ELSE 0 END) AS withdrawnMembers
        FROM members
      `).get()

      const settings = db.prepare('SELECT base_amount FROM dues_settings WHERE year = ?').get(year)

      let paidCount = null, unpaidCount = null, paidRate = null

      if (settings) {
        const target = db.prepare(
          `SELECT COUNT(*) AS cnt FROM members WHERE status IN ('active', 'dormant')`
        ).get().cnt
        const paid = db.prepare(
          `SELECT COUNT(*) AS cnt FROM dues WHERE year = ?
           AND member_id IN (SELECT id FROM members WHERE status IN ('active', 'dormant'))`
        ).get(year).cnt

        paidCount   = paid
        unpaidCount = target - paid
        paidRate    = target > 0 ? Math.round((paid * 100.0) / target) : null
      }

      return {
        ok: true,
        data: {
          totalMembers: counts.totalMembers,
          activeMembers: counts.activeMembers,
          dormantMembers: counts.dormantMembers,
          withdrawnMembers: counts.withdrawnMembers,
          paidCount, unpaidCount, paidRate,
          baseAmount: settings ? settings.base_amount : null
        }
      }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  })
}
