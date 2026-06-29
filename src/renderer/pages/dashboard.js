import { registerPage } from '../router.js'
import { toast } from '../components/toast.js'

async function initDashboard() {
  const res = await window.api.stats.dashboard()
  if (!res.ok) { toast('통계 로딩 실패: ' + res.error, 'error'); return }
  const d = res.data

  document.getElementById('stat-total').textContent = d.totalMembers
  document.getElementById('stat-total-sub').textContent =
    `활동 ${d.activeMembers} · 휴면 ${d.dormantMembers} · 탈퇴 ${d.withdrawnMembers}`

  if (d.paidCount !== null) {
    document.getElementById('stat-paid').textContent = d.paidCount
    document.getElementById('stat-paid-sub').textContent =
      d.paidRate !== null ? `납부율 ${d.paidRate}%` : ''
    document.getElementById('stat-unpaid').textContent = d.unpaidCount
    document.getElementById('stat-unpaid-sub').textContent = ''
  } else {
    document.getElementById('stat-paid').textContent = '-'
    document.getElementById('stat-paid-sub').textContent = '기준 회비 미설정'
    document.getElementById('stat-unpaid').textContent = '-'
    document.getElementById('stat-unpaid-sub').textContent = '기준 회비 미설정'
  }

  document.getElementById('stat-base').textContent =
    d.baseAmount !== null ? d.baseAmount.toLocaleString() + '원' : '미설정'
}

registerPage('dashboard', initDashboard)
