import { registerPage } from '../router.js'
import { toast } from '../components/toast.js'

function bindSaveButtons() {
  document.querySelectorAll('.btn-save-dues').forEach(btn => {
    btn.onclick = async () => {
      const year   = Number(btn.dataset.year)
      const input  = document.querySelector(`.dues-amount-input[data-year="${year}"]`)
      const amount = Number(input.value)
      if (!amount || amount <= 0) { toast('금액을 올바르게 입력하세요.', 'error'); return }
      const res = await window.api.duesSettings.upsert({ year, base_amount: amount })
      if (!res.ok) { toast(res.error, 'error'); return }
      toast(`${year}년 기준 회비가 저장되었습니다.`)
    }
  })
}

async function initSettings() {
  const res = await window.api.duesSettings.list()
  if (!res.ok) { toast('설정 로딩 실패', 'error'); return }
  const list = res.data
  const container = document.getElementById('dues-settings-list')

  if (!list.length) {
    container.innerHTML = '<p style="color:var(--color-gray-500);font-size:13px;">등록된 기준 회비가 없습니다.</p>'
  } else {
    container.innerHTML = list.map(s => `
      <div class="settings-row">
        <label>${s.year}년</label>
        <input type="number" class="dues-amount-input" data-year="${s.year}" value="${s.base_amount}" min="1" style="max-width:160px;" />
        <button class="btn btn-sm btn-primary btn-save-dues" data-year="${s.year}">저장</button>
      </div>
    `).join('')
    bindSaveButtons()
  }
}

export function bindSettingsPage() {
  document.getElementById('btn-add-dues-year').onclick = async () => {
    const yearInput   = document.getElementById('new-dues-year')
    const amountInput = document.getElementById('new-dues-amount')
    const year   = Number(yearInput.value)
    const amount = Number(amountInput.value)
    if (!year || year < 2000 || year > 2100) { toast('연도를 올바르게 입력하세요.', 'error'); return }
    if (!amount || amount <= 0) { toast('금액을 올바르게 입력하세요.', 'error'); return }
    const res = await window.api.duesSettings.upsert({ year, base_amount: amount })
    if (!res.ok) { toast(res.error, 'error'); return }
    toast(`${year}년 기준 회비가 추가되었습니다.`)
    yearInput.value = ''
    amountInput.value = ''
    initSettings()
  }
}

registerPage('settings', initSettings)
