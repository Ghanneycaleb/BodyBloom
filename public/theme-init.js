// Blocking head bootstrap: apply the preference before React or its stylesheet loads.
// Keep the key and validation aligned with src/features/theme/theme.storage.ts.
;(function () {
  var preference = null
  try { preference = window.localStorage.getItem('bodybloom.theme') } catch { /* System fallback. */ }
  var theme = preference === 'light' || preference === 'dark'
    ? preference
    : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
})()
