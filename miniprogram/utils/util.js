export function formatDate(date) {
  function padStr(obj) {
    return obj.toString().padStart(2, '0')
  }
  const month = padStr(date.getMonth() + 1)
  const strDate = padStr(date.getDate())
  const hour = padStr(date.getHours())
  const minute = padStr(date.getMinutes())
  const second = padStr(date.getSeconds())
  return `${date.getFullYear()}-${month}-${strDate} ${hour}:${minute}:${second}`
}