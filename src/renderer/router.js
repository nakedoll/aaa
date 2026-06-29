let isDirty = false
const pageInits = {}

export function registerPage(id, fn) {
  pageInits[id] = fn
}

export function setDirty(val) {
  isDirty = val
}

export function navigate(pageId, params = {}) {
  if (isDirty) {
    if (!confirm('저장하지 않은 내용이 있습니다. 이동하시겠습니까?')) return
    isDirty = false
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  const page = document.getElementById('page-' + pageId)
  if (page) page.classList.add('active')

  document.querySelectorAll('#sidebar nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId)
  })

  const titles = {
    dashboard:       '대시보드',
    members:         '회원 목록',
    'member-detail': '회원 상세',
    'member-form':   '회원 추가 / 수정',
    settings:        '설정'
  }
  const topbar = document.getElementById('topbar')
  if (topbar) topbar.textContent = titles[pageId] || ''

  if (pageInits[pageId]) pageInits[pageId](params)
}
