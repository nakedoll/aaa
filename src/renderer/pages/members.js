import { registerPage, navigate } from '../router.js'
import { toast } from '../components/toast.js'
import { memberBadge, duesBadge } from '../components/badge.js'
import { escHtml } from '../utils.js'

let allMembers = []

function renderMembers() {
  const search       = document.getElementById('filter-search').value.trim().toLowerCase()
  const year         = document.getElementById('filter-year').value
  const duesStatus   = document.getElementById('filter-dues').value
  const memberStatus = document.getElementById('filter-member').value

  let rows = allMembers.filter(m => {
    if (search && !m.company_name.toLowerCase().includes(search)) return false
    if (year && !m.joined_at?.startsWith(year)) return false
    if (duesStatus !== 'all') {
      if (m.status === 'withdrawn') return false
      if (m.currentYearDuesStatus !== duesStatus) return false
    }
    if (memberStatus === 'current'   && m.status === 'withdrawn') return false
    if (memberStatus === 'withdrawn' && m.status !== 'withdrawn') return false
    return true
  })

  rows.sort((a, b) => a.company_name.localeCompare(b.company_name, 'ko-KR'))

  const tbody = document.getElementById('members-tbody')
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><p>검색 결과가 없습니다.</p></div></td></tr>`
    return
  }

  tbody.innerHTML = rows.map(m => {
    const duesCell = m.status === 'withdrawn'
      ? `<span class="badge badge-na">-</span>`
      : duesBadge(m.currentYearDuesStatus)
    return `
      <tr class="clickable" data-id="${m.id}">
        <td>${escHtml(m.company_name)}</td>
        <td>${escHtml(m.ceo_name)}</td>
        <td>${escHtml(m.contact_name || '-')}</td>
        <td>${escHtml(m.contact_phone || '-')}</td>
        <td>${escHtml(m.joined_at || '-')}</td>
        <td>${memberBadge(m.status)}</td>
        <td>${duesCell}</td>
      </tr>`
  }).join('')

  tbody.querySelectorAll('tr.clickable').forEach(tr => {
    tr.onclick = () => navigate('member-detail', { id: Number(tr.dataset.id) })
  })
}

async function initMembers() {
  const res = await window.api.members.list()
  if (!res.ok) { toast('회원 목록 로딩 실패: ' + res.error, 'error'); return }
  allMembers = res.data

  const years = [...new Set(allMembers.map(m => m.joined_at?.slice(0, 4)).filter(Boolean))].sort().reverse()
  const sel = document.getElementById('filter-year')
  sel.innerHTML = '<option value="">전체 연도</option>' +
    years.map(y => `<option value="${y}">${y}년</option>`).join('')

  renderMembers()
}

export function bindMembersPage() {
  document.getElementById('filter-search').oninput  = renderMembers
  document.getElementById('filter-year').onchange   = renderMembers
  document.getElementById('filter-dues').onchange   = renderMembers
  document.getElementById('filter-member').onchange = renderMembers
  document.getElementById('btn-add-member').onclick =
    () => navigate('member-form', { mode: 'create' })
}

registerPage('members', initMembers)
