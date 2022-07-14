export const COUNTRY_ENUM = {
  GHANA: 'GHS',
  NIGERIA: 'NGN',
  KENYA: 'KES',
  RWANDA: 'RWF',
  SOUTH_AFRICA: 'ZAR',
  TANZANIA: 'TZA',
  UGANDA: 'UGA',
  BOTSWANA: 'BWA',
  ZAMBIA: 'ZMW',
  CAMEROON: 'CMR',
  SENEGAL: 'SEN',
}

export const COUNTRY_DETAILS = {
  NIGERIA: {
    name: 'Nigeria',
    code: 'NGN',
    dialCode: '+234',
    symbol: '₦',
  },
}

export const API_STATE = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  FULFILLED: 'fulfilled',
}

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  FAILED: 'failed',
}

export const TRANSACTION_STATUS_ARRAY = Object.values(TRANSACTION_STATUS)

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const EMAIL_OR_PHONE_REGEX =
  /^(?:\+?[0-9]{6,14}[0-9]|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/
