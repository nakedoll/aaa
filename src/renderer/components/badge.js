export function memberBadge(status) {
  const labels = { active: '활동', dormant: '휴면', withdrawn: '탈퇴' }
  return `<span class="badge badge-${status}">${labels[status] || status}</span>`
}

export function duesBadge(status) {
  if (status === 'paid')           return `<span class="badge badge-paid">납부</span>`
  if (status === 'unpaid')         return `<span class="badge badge-unpaid">미납</span>`
  if (status === 'not_configured') return `<span class="badge badge-na">미설정</span>`
  return `<span class="badge badge-na">-</span>`
}
