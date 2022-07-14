export default (context) => {
  const { store, app, redirect } = context
  app.$axios.setToken(store.getters.token, 'Bearer')
  app.$axios.onRequest((config) => {
    console.log('Making request to api: ' + config.baseURL + config.url)

    // config.baseURL = process.env.apiUrl
  })

  app.$axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    console.log('axios erroror >>>>>', code)
    if (code === 401 || code === 403) {
      store.commit('set_auth', null)

      app.$axios.setToken(false)
      app.$cookiz.removeAll()
      app.$store.commit('set_auth', null)

      app.$axios.setToken(false)
      return redirect('/login')
    }
  })
}
