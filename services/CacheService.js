/**
 *  WARNING!! WARNING!! WARNING!! WARNING!! WARNING!!
 *  ARE YOU SURE WHAT YOU WANT TO DO HERE CANNOT BE DONE VIA VUEX ?
 *  CHECK AGAIN AND BE SURE
 *  this is only implemented for cases where we cannot use or access Vuex store.
 *
 *  EXAMPLE
 *  A typical example was using user's country in filter.js
 */
import Cookie from 'js-cookie'

const KEYS = {
  COUNTRY: 'currentCountry',
  AUTH: 'auth',
}
const _cache = {}
const CacheService = {
  set: (key, value) => {
    if (!Object.values(KEYS).includes(key)) {
      throw new Error(`key ${key} does not exist`)
    }

    if (value) {
      _cache[key] = value
    }
  },
  get: (key) => {
    if (!Object.values(KEYS).includes(key)) {
      throw new Error(`key ${key} does not exist`)
    }

    return _cache[key] || (Cookie.get(key) && JSON.parse(Cookie.get(key)))
  },
  keys: KEYS,
}

Object.freeze(CacheService)
export default CacheService
