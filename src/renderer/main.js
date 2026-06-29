import { navigate } from './router.js'
import './pages/dashboard.js'
import './pages/members.js'
import './pages/memberDetail.js'
import './pages/memberForm.js'
import './pages/settings.js'
import { bindMembersPage }  from './pages/members.js'
import { bindDetailPage }   from './pages/memberDetail.js'
import { bindMemberForm }   from './pages/memberForm.js'
import { bindSettingsPage } from './pages/settings.js'

document.addEventListener('DOMContentLoaded', () => {
  // 사이드바 클릭 바인딩
  document.querySelectorAll('#sidebar nav a[data-page]').forEach(a => {
    a.onclick = (e) => { e.preventDefault(); navigate(a.dataset.page) }
  })

  // 각 페이지 이벤트 바인딩
  bindMembersPage()
  bindDetailPage()
  bindMemberForm()
  bindSettingsPage()

  // 초기 진입
  navigate('dashboard')
})
