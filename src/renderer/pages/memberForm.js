import { registerPage, navigate, setDirty } from '../router.js'
import { toast } from '../components/toast.js'
import { localDateStr } from '../utils.js'

let formMode = 'create'
let formMemberId = null

function clearErrors() {
  document.querySelectorAll('#member-form .error-msg').forEach(el => {
    el.style.display = 'none'; el.textContent = ''
  })
  document.querySelectorAll('#member-form .error').forEach(el => el.classList.remove('error'))
}

function showError(fieldId, msg) {
  const field = document.getElementById(fieldId)
  const errEl = field?.nextElementSibling
  field?.classList.add('error')
  if (errEl?.classList.contains('error-msg')) {
    errEl.textContent = msg; errEl.style.display = 'block'
  }
}

function validateForm() {
  clearErrors()
  let valid = true
  const today = localDateStr()

  const company = document.getElementById('field-company').value.trim()
  if (!company) { showError('field-company', '회사명을 입력하세요.'); valid = false }
  else if (company.length > 100) { showError('field-company', '최대 100자까지 입력 가능합니다.'); valid = false }

  const ceo = document.getElementById('field-ceo').value.trim()
  if (!ceo) { showError('field-ceo', '대표자 이름을 입력하세요.'); valid = false }

  const joinedAt = document.getElementById('field-joined-at').value
  if (!joinedAt) { showError('field-joined-at', '가입일을 입력하세요.'); valid = false }
  else if (joinedAt > today) { showError('field-joined-at', '미래 날짜는 입력할 수 없습니다.'); valid = false }

  const phone = document.getElementById('field-contact-phone').value.trim()
  if (phone && !/^[0-9]{2,4}-[0-9]{3,4}-[0-9]{4}$/.test(phone)) {
    showError('field-contact-phone', '연락처 형식이 올바르지 않습니다. (예: 02-1234-5678)')
    valid = false
  }

  const email = document.getElementById('field-contact-email').value.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('field-contact-email', '이메일 형식이 올바르지 않습니다.')
    valid = false
  }
  return valid
}

function getFormData() {
  return {
    company_name:  document.getElementById('field-company').value.trim(),
    ceo_name:      document.getElementById('field-ceo').value.trim(),
    contact_name:  document.getElementById('field-contact-name').value.trim() || null,
    contact_phone: document.getElementById('field-contact-phone').value.trim() || null,
    contact_email: document.getElementById('field-contact-email').value.trim() || null,
    joined_at:     document.getElementById('field-joined-at').value,
    status:        document.getElementById('field-status').value,
    memo:          document.getElementById('field-memo').value.trim() || null
  }
}

async function submitForm() {
  if (!validateForm()) return
  const data = getFormData()
  const res = formMode === 'create'
    ? await window.api.members.create(data)
    : await window.api.members.update(formMemberId, data)

  if (!res.ok) { toast(res.error, 'error'); return }
  setDirty(false)
  toast(formMode === 'create' ? '회원이 추가되었습니다.' : '수정되었습니다.')
  if (formMode === 'create') navigate('members')
  else navigate('member-detail', { id: formMemberId })
}

async function initMemberForm({ mode = 'create', id = null } = {}) {
  formMode = mode
  formMemberId = id
  setDirty(false)
  clearErrors()
  document.getElementById('form-title').textContent = mode === 'create' ? '회원 추가' : '회원 수정'

  if (mode === 'edit' && id) {
    const res = await window.api.members.get(id)
    if (!res.ok) { toast('회원 로딩 실패', 'error'); return }
    const m = res.data
    document.getElementById('field-company').value      = m.company_name || ''
    document.getElementById('field-ceo').value          = m.ceo_name || ''
    document.getElementById('field-contact-name').value  = m.contact_name || ''
    document.getElementById('field-contact-phone').value = m.contact_phone || ''
    document.getElementById('field-contact-email').value = m.contact_email || ''
    document.getElementById('field-joined-at').value    = m.joined_at || ''
    document.getElementById('field-status').value       = m.status === 'withdrawn' ? 'active' : m.status
    document.getElementById('field-memo').value         = m.memo || ''
  } else {
    document.getElementById('member-form').reset()
    document.getElementById('field-joined-at').value = localDateStr()
  }
}

export function bindMemberForm() {
  document.getElementById('member-form').addEventListener('input', () => setDirty(true))
  document.getElementById('btn-form-save').onclick   = submitForm
  document.getElementById('btn-form-cancel').onclick = () => {
    setDirty(false)
    if (formMode === 'edit') navigate('member-detail', { id: formMemberId })
    else navigate('members')
  }
}

registerPage('member-form', initMemberForm)
