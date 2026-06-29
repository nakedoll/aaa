import path from 'path'
import fs from 'fs/promises'
import { app } from 'electron'

export async function autoBackup(db) {
  try {
    const dir = path.join(app.getPath('userData'), 'backups')
    await fs.mkdir(dir, { recursive: true })

    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
                + `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
    const dest = path.join(dir, `backup_${stamp}.db`)

    await db.backup(dest)

    const files = (await fs.readdir(dir))
      .filter(f => /^backup_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.db$/.test(f))
      .sort()
    while (files.length > 5) {
      await fs.unlink(path.join(dir, files.shift()))
    }
  } catch (err) {
    console.error('[autoBackup] 백업 실패:', err)
  }
}
