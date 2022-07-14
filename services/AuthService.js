export default {
  redirectToRoute(user, context) {
    // the context is the nuxt object passed in
    const { query } = context.$route
    // const path = query.redirectTo || '/'

    // we are done with it here so we remove it
    delete query.redirectTo

    if (user.role.includes('admin')) context.$router.push('/')
    else
      context.$router.push({
        path: '/login',
        query,
      })
  },

  logout(context) {
    context.$store.commit('set_auth', null)
    context.$cookiz.remove('auth')
    context.$axios.setToken(false)
    if (context.$router) {
      context.$router.push('/login')
    } else if (context.redirect) {
      context.redirect('/login')
    }
  },
}
