export const getUrlLink = (link) => {
  if (typeof window === 'undefined') return
  return window.location.href.split('/')[0] + '//' + window.location.href.split('/')[2] + '/' + link
}
