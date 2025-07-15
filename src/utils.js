const parseDateTime = (dateTimeStr) => {
  if (!dateTimeStr || typeof dateTimeStr !== 'string') return null;
  const parts = dateTimeStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2}):(\d{2})$/);
  if (parts) {
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1;
    const year = parseInt(parts[3], 10);
    const hour = parseInt(parts[4], 10);
    const minute = parseInt(parts[5], 10);
    const second = parseInt(parts[6], 10);
    const date = new Date(year, month, day, hour, minute, second);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }
  }
  const nativeDate = new Date(dateTimeStr);
  if (!isNaN(nativeDate)) return nativeDate;
  return null;
};

const formatDuration = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '0:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return str; // Only sanitize strings
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  const reg = /[&<>'"/]/ig;
  return str.replace(reg, (match) => (map[match]));
};

const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes, seconds] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  const m = minutes.padStart(2, '0');
  const s = seconds ? `:${seconds.padStart(2, '0')}` : '';
  return `${h}:${m}${s} ${ampm}`;
};

export { parseDateTime, formatDuration, sanitizeString, formatTimeTo12Hour };
