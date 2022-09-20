export default function ({ store, redirect, app }) {
  const auth = app.$cookiz.get('auth')
  const country = app.$cookiz.get('country')
  const token = (auth && auth.token) || ''

  if (auth) {
    store.commit('set_auth', auth)
  }

  if (country) {
    store.commit('set_country', country)
  }

  if (token) {
    app.$axios.setToken(auth.token, 'Bearer')
  }
  // If the user is not authenticated
  if (!store.getters.isAuthenticated) {
    return redirect('/login')
  }
}
