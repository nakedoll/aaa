import { registerPage, navigate } from '../router.js'
import { toast } from '../components/toast.js'
import { memberBadge } from '../components/badge.js'
import { showModal, showFormModal } from '../components/modal.js'
import { localDateStr, escHtml } from '../utils.js'

let detailMemberId = null
let detailMember   = null

function renderDetailInfo(m) {
  document.getElementById('detail-company').textContent       = m.company_name
  document.getElementById('detail-ceo').textContent          = m.ceo_name
  document.getElementById('detail-contact-name').textContent  = m.contact_name  || '-'
  document.getElementById('detail-contact-phone').textContent = m.contact_phone || '-'
  document.getElementById('detail-contact-email').textContent = m.contact_email || '-'
  document.getElementById('detail-joined').textContent        = m.joined_at || '-'
  document.getElementById('detail-status').innerHTML          = memberBadge(m.status)
  document.getElementById('detail-memo').textContent          = m.memo || '-'
}

function renderDetailButtons(m) {
  const hidden = m.status === 'withdrawn'
  document.getElementById('btn-detail-edit').style.display      = hidden ? 'none' : ''
  document.getElementById('btn-detail-withdraw').style.display  = hidden ? 'none' : ''
  document.getElementById('btn-detail-add-dues').style.display  = hidden ? 'none' : ''
}

function renderDuesHistory(dues) {
  const tbody = document.getElementById('dues-tbody')
  const isWithdrawn = detailMember?.status === 'withdrawn'
  if (!dues.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><p>납부 이력이 없습니다.</p></div></td></tr>`
    return
  }
  tbody.innerHTML = dues.map(d => `
    <tr>
      <td>${d.year}년</td>
      <td>${d.amount.toLocaleString()}원</td>
      <td>${escHtml(d.paid_at)}</td>
      <td>${isWithdrawn ? '' : `<button class="btn btn-sm btn-secondary btn-edit-dues"
          data-id="${d.id}" data-year="${d.year}" data-amount="${d.amount}" data-paid-at="${escHtml(d.paid_at)}">수정</button>`}</td>
    </tr>
  `).join('')

  tbody.querySelectorAll('.btn-edit-dues').forEach(btn => {
    btn.onclick = () => openDuesEditModal({
      id:      Number(btn.dataset.id),
      year:    Number(btn.dataset.year),
      amount:  Number(btn.dataset.amount),
      paid_at: btn.dataset.paidAt
    })
  })
}

async function refreshDetail() {
  const [mRes, dRes] = await Promise.all([
    window.api.members.get(detailMemberId),
    window.api.dues.list(detailMemberId)
  ])
  if (!mRes.ok) { toast('회원 정보 로딩 실패', 'error'); return }
  detailMember = mRes.data
  renderDetailInfo(detailMember)
  if (!dRes.ok) {
    toast('납부 이력 로딩 실패: ' + dRes.error, 'error')
    document.getElementById('dues-tbody').innerHTML =
      `<tr><td colspan="4"><div class="empty-state"><p>납부 이력을 불러오지 못했습니다.</p></div></td></tr>`
  } else {
    renderDuesHistory(dRes.data)
  }
  renderDetailButtons(detailMember)
}

function openDuesAddModal() {
  const year = new Date().getFullYear()
  const overlay = showFormModal({
    title: '납부 등록',
    fields: [
      { name: 'year',    label: '연도',    type: 'number', value: year,   required: true, placeholder: '예: 2025' },
      { name: 'amount',  label: '금액(원)', type: 'number', value: '',    required: true, placeholder: '기준 회비 없으면 직접 입력' },
      { name: 'paid_at', label: '납부일',  type: 'date',   value: localDateStr(), required: true }
    ],
    onSubmit: async (data) => {
      if (!data.year || !data.amount || !data.paid_at) { toast('모든 필드를 입력하세요.', 'error'); return false }
      const res = await window.api.dues.create({
        member_id: detailMemberId,
        year:      Number(data.year),
        amount:    Number(data.amount),
        paid_at:   data.paid_at
      })
      if (!res.ok) { toast(res.error, 'error'); return false }
      toast('납부 내역이 등록되었습니다.')
      refreshDetail()
    }
  })

  // 기준 회비 자동 완성
  setTimeout(async () => {
    const settingsRes = await window.api.duesSettings.list()
    if (!settingsRes.ok) return
    const yearInput   = overlay.querySelector('[name="year"]')
    const amountInput = overlay.querySelector('[name="amount"]')
    if (!yearInput || !amountInput) return
    const fill = () => {
      const s = settingsRes.data.find(s => s.year === Number(yearInput.value))
      amountInput.value = s ? s.base_amount : ''
    }
    yearInput.addEventListener('input', fill)
    fill()
  }, 50)
}

function openDuesEditModal({ id, year, amount, paid_at }) {
  showFormModal({
    title: `납부 수정 (${year}년)`,
    fields: [
      { name: 'amount',  label: '금액(원)', type: 'number', value: amount,   required: true },
      { name: 'paid_at', label: '납부일',   type: 'date',   value: paid_at, required: true }
    ],
    onSubmit: async (data) => {
      if (!data.amount || !data.paid_at) { toast('모든 필드를 입력하세요.', 'error'); return false }
      const res = await window.api.dues.update(id, { amount: Number(data.amount), paid_at: data.paid_at })
      if (!res.ok) { toast(res.error, 'error'); return false }
      toast('납부 내역이 수정되었습니다.')
      refreshDetail()
    }
  })
}

async function initMemberDetail({ id } = {}) {
  if (!id) return
  detailMemberId = id
  await refreshDetail()
}

export function bindDetailPage() {
  document.getElementById('btn-detail-back').onclick     = () => navigate('members')
  document.getElementById('btn-detail-edit').onclick     = () =>
    navigate('member-form', { mode: 'edit', id: detailMemberId })
  document.getElementById('btn-detail-add-dues').onclick = openDuesAddModal
  document.getElementById('btn-detail-withdraw').onclick = () =>
    showModal({
      title: '탈퇴 처리',
      message: '탈퇴 처리하시겠습니까? 데이터는 보존됩니다.',
      danger: true,
      onConfirm: async () => {
        const res = await window.api.members.withdraw(detailMemberId)
        if (!res.ok) { toast(res.error, 'error'); return }
        toast('탈퇴 처리되었습니다.')
        navigate('members')
      }
    })
}

registerPage('member-detail', initMemberDetail)
