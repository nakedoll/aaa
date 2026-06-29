const { defineConfig } = require('electron-vite')

module.exports = defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['better-sqlite3']
      }
    }
  },
  preload: {},
  renderer: {}
})
