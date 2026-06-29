import registerMembersHandlers from './members.js'
import registerDuesHandlers from './dues.js'
import registerDuesSettingsHandlers from './duesSettings.js'
import registerStatsHandlers from './stats.js'

export default function registerIpcHandlers(db) {
  registerMembersHandlers(db)
  registerDuesHandlers(db)
  registerDuesSettingsHandlers(db)
  registerStatsHandlers(db)
}
