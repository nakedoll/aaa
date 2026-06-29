const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  members: {
    list:     ()         => ipcRenderer.invoke('members:list'),
    get:      (id)       => ipcRenderer.invoke('members:get', id),
    create:   (data)     => ipcRenderer.invoke('members:create', data),
    update:   (id, data) => ipcRenderer.invoke('members:update', id, data),
    withdraw: (id)       => ipcRenderer.invoke('members:withdraw', id)
  },
  dues: {
    list:   (memberId) => ipcRenderer.invoke('dues:list', memberId),
    create: (data)     => ipcRenderer.invoke('dues:create', data),
    update: (id, data) => ipcRenderer.invoke('dues:update', id, data)
  },
  duesSettings: {
    list:   ()     => ipcRenderer.invoke('dues_settings:list'),
    upsert: (data) => ipcRenderer.invoke('dues_settings:upsert', data)
  },
  stats: {
    dashboard: () => ipcRenderer.invoke('stats:dashboard')
  }
  // backup IPC 없음 — 자동 백업은 메인 프로세스 내부에서만 실행
})
