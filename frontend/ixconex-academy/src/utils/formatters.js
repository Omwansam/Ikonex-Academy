export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFullName(firstName, lastName) {
  return `${firstName} ${lastName}`.trim();
}

export function formatPhone(phone) {
  if (!phone) return '—';
  return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

export function formatPercentage(value) {
  if (value == null) return '—';
  return `${Number(value).toFixed(1)}%`;
}

export function truncate(text, length = 50) {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}…` : text;
}
