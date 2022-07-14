export default function ({ store, redirect, app }) {
  const auth = app.$cookiz.get('auth')
  const token = (auth && auth.token) || ''

  if (auth) {
    store.commit('set_auth', auth)
  }

  if (token) {
    app.$axios.setToken(auth.token, 'Bearer')
  }

  if (store.getters.isAuthenticated) {
    return redirect('/')
  }
}
