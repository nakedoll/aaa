function escAttr(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function showModal({ title, message, onConfirm, danger = false }) {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = `
    <div class="modal-box">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="modal-cancel">취소</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="modal-confirm">확인</button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)
  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove()
  overlay.querySelector('#modal-confirm').onclick = () => { overlay.remove(); onConfirm() }
}

export function showFormModal({ title, fields, onSubmit }) {
  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'

  const fieldHtml = fields.map(f => `
    <div class="form-group">
      <label>${f.label}${f.required ? '<span class="required">*</span>' : ''}</label>
      ${f.type === 'select'
        ? `<select name="${f.name}">${f.options.map(o => `<option value="${o.value}"${o.selected ? ' selected' : ''}>${o.label}</option>`).join('')}</select>`
        : `<input type="${f.type || 'text'}" name="${f.name}" value="${escAttr(f.value)}" placeholder="${escAttr(f.placeholder || '')}" />`
      }
      <div class="error-msg" style="display:none"></div>
    </div>
  `).join('')

  overlay.innerHTML = `
    <div class="modal-box">
      <h3>${title}</h3>
      <div class="modal-form-body">${fieldHtml}</div>
      <div class="modal-actions">
        <button class="btn btn-secondary" id="modal-cancel">취소</button>
        <button class="btn btn-primary" id="modal-submit">저장</button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)
  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove()
  overlay.querySelector('#modal-submit').onclick = async () => {
    const data = {}
    fields.forEach(f => {
      const el = overlay.querySelector(`[name="${f.name}"]`)
      data[f.name] = el ? el.value : ''
    })
    const ok = await onSubmit(data, overlay)
    if (ok !== false) overlay.remove()
  }
  return overlay
}
