import Vue from 'vue'
import moment from 'moment'
import { isUndefined, isNumber, values, find, lowerCase } from 'lodash'
import CacheService from '../services/CacheService'

Vue.filter('ellipses', (value, maxLength = 30) => {
  if (!value) return ''
  if (value.length <= maxLength) return value

  return `${value.substring(0, maxLength - 3)}...`
})

Vue.filter('displayName', (value) => {
  if (!value) return ''

  return `${value.firstName} ${value.lastName}`
})

Vue.filter('number', (value) => {
  if (typeof value !== 'number') {
    return value
  }
  return value.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')
})

Vue.filter('numberFormat', (value) => {
  if (isUndefined(value) || !isNumber(value)) return '0'
  const newValue = parseFloat(value.toFixed(2))

  return `${newValue.toLocaleString('en')}`
})

Vue.filter('numberFormatToFloat', (value) => {
  if (isUndefined(value) || !isNumber(value)) return '0'
  const newValue = parseFloat(value.toFixed(2))

  return newValue
})

Vue.filter('displayDate', (value, format, emptyState) => {
  if (!moment(value).isValid()) return emptyState || ''
  return moment(value).format(format || 'Do MMM, YYYY h:mm:ss a')
})

Vue.filter('humanDate', (value) => moment(value).fromNow())

Vue.filter('removeBrackets', (value) => value.replace(/\([^)]*\)/, ''))

Vue.filter('addNewLine', (value) => {
  const re = /\([^)]*\)/
  const t = re.test(value)
  return t ? value.replace(re, (h) => `<br>${h}`) : `${value}<br>`
})

Vue.filter('capitalize', (value) => {
  if (!value) return ''
  value = lowerCase(value.toString())
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('maskNumber', (number) => {
  if (!number) return ''
  const length = number.length
  return `*******${number.substring(length - 3, length)}`
})

Vue.filter('errorMessage', (error) => {
  let message = ''
  const DEFAULT_ERROR_MESSAGE = 'Something unexpected happened'

  if (error.response && error.response.data) {
    message =
      error.response.data?.message ||
      error.response.data?.response?.message ||
      DEFAULT_ERROR_MESSAGE
  } else if (error.data && error.data.response) {
    if (error.data.response.message) {
      message = error.data.response.message
    }

    const { response } = error.data
    if (response.errors) {
      const first_error = values(response.errors)[0]
      const required = find(first_error, {
        rule: 'required',
      })

      if (required) {
        message = required.message || DEFAULT_ERROR_MESSAGE
      } else {
        message = first_error[0].message || DEFAULT_ERROR_MESSAGE
      }
    }

    if (response.errors && response.errors.error) {
      if (response.errors.error.message) {
        message = response.errors.error.message || DEFAULT_ERROR_MESSAGE
      } else {
        message = response.errors.error || DEFAULT_ERROR_MESSAGE
      }
    }

    if (!message) {
      message = DEFAULT_ERROR_MESSAGE
    }

    if (!message && response.message) {
      message = response.message || DEFAULT_ERROR_MESSAGE
    }
  } else if (error.data && error.data.message) {
    message = error.data.message || DEFAULT_ERROR_MESSAGE
  } else if (error.message) {
    message = error.message || DEFAULT_ERROR_MESSAGE
  } else {
    message = DEFAULT_ERROR_MESSAGE
  }

  return message
})

Vue.filter('currency', (value) => {
  const COUNTRY = CacheService.get(CacheService.keys.COUNTRY)

  if (typeof value !== 'number') {
    return value
  }
  const formatter = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: COUNTRY.code,
  })
  return formatter.format(value)
})

Vue.filter('currencySymbol', (value) => {
  const COUNTRY = CacheService.get(CacheService.keys.COUNTRY)

  if (isUndefined(value) || !isNumber(value)) return `${COUNTRY.symbol}0`
  const newValue = parseFloat(value.toFixed(2))
  return `${COUNTRY.symbol}${newValue.toLocaleString('en')}`
})

Vue.filter('currencyStat', (value) => {
  const COUNTRY = CacheService.get(CacheService.keys.COUNTRY)

  if (typeof value !== 'number') {
    return value
  }
  const ranges = [
    { divider: 1e18, suffix: 'BT' },
    { divider: 1e15, suffix: 'MT' },
    { divider: 1e12, suffix: 'T' },
    { divider: 1e9, suffix: 'B' },
    { divider: 1e6, suffix: 'M' },
    { divider: 1e3, suffix: 'K' },
  ]
  for (let i = 0; i < ranges.length; i++) {
    if (value >= ranges[i].divider) {
      const newValue = value / ranges[i].divider
      const displayValue = parseFloat(newValue.toFixed(2))
      return `${COUNTRY.symbol}${
        displayValue.toLocaleString('en') + ranges[i].suffix
      }`
    }
  }
  return `${COUNTRY.symbol}${value.toFixed(2)}`
})

Vue.filter('cryptoRate', (value) => {
  if (isUndefined(value)) return ''

  return `below ${value.mark} untis $${value.below}; above ${value.mark} units $${value.above}`
})
