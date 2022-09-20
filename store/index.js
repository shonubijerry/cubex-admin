import { isEmpty } from 'lodash'
import CacheService from '../services/CacheService'

// const cookieparser = require('cookieparser')

export const state = () => ({
  /* User */
  auth: null,
  country: null,

  /* NavBar */
  isNavBarVisible: true,

  /* FooterBar */
  isFooterBarVisible: true,

  /* Aside */
  isAsideVisible: true,
  isAsideMobileExpanded: false,
})

export const mutations = {
  /* A fit-them-all commit */
  basic(state, payload) {
    state[payload.key] = payload.value
  },
  set_auth(state, authData) {
    state.auth = authData
  },
  set_country(state, data) {
    state.country = data

    // this is only implemented for cases where we cannot use or access Vuex store.
    CacheService.set(CacheService.keys.COUNTRY, data)
  },

  /* User */
  user(state, payload) {
    if (payload.name) {
      state.userName = payload.name
    }
    if (payload.email) {
      state.userEmail = payload.email
    }
    if (payload.avatar) {
      state.userAvatar = payload.avatar
    }
  },

  /* Aside Mobile */
  asideMobileStateToggle(state, payload = null) {
    const htmlClassName = 'has-aside-mobile-expanded'

    let isShow

    if (payload !== null) {
      isShow = payload
    } else {
      isShow = !state.isAsideMobileExpanded
    }

    if (isShow) {
      document.documentElement.classList.add(htmlClassName)
    } else {
      document.documentElement.classList.remove(htmlClassName)
    }

    state.isAsideMobileExpanded = isShow
  },
  set_last_page(state, data) {
    if (!data) return

    const { path, page, status, filter_date } = data
    state.lastVisitedPage = {
      path,
      page,
      status,
      filter_date,
    }
    this.$cookiz.set('last_visited', state.lastVisitedPage, {
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
    })
  },
}

export const getters = {
  isAuthenticated(state) {
    return !isEmpty(state.auth)
  },
  token(state) {
    return state.auth?.token
  },
}

export const actions = {
  nuxtServerInit({ commit, state }, { req, redirect, app }) {
    const lastPage = null

    commit('set_last_page', lastPage)
    const country = this.$cookiz.get('country')
    commit('set_country', country)
  },
  async login({ commit }, credentials) {
    try {
      const response = await this.$axios.$post('/auth/login', credentials)
      const data = response.data
      const vaildRoles = ['superUser']
      if (!data.role || !~vaildRoles.indexOf(data.role))
        throw new Error('Invalid Role on login')
      const auth = {
        token: data.token,

        user: {
          role: data.role,
          email: data.email,
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      }

      this.$axios.setToken(data.token, 'Bearer')
      this.$cookiz.set('auth', auth, {
        path: '/',
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      })
      this.$cookiz.set('country', data.country)
      commit('set_auth', auth)
      commit('set_country', data.country)
      return data
    } catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
  },
}
