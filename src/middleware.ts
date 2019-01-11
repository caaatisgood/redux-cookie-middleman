import Cookies from 'js-cookie'
import omit from 'lodash.omit'
import setCookie from './setCookie'
import getCookie from './getCookie'
import {
  ReduxStore,
  ReduxAction
} from './types'

export const COOKIE_STORAGE = Symbol('COOKIE_STORAGE')

export default ({ dispatch, getState }: ReduxStore) => (next: Function) => (action: ReduxAction) => {
  const operation = action[COOKIE_STORAGE]
  if (!operation) {
    return next(action)
  }

  const {
    method,
    key,
    value,
    actionType,
    domain,
    expires,
    secure,
    path,
    asJson = false,
    callback,
  } = operation

  switch (method) {
    case 'get':
      break
    case 'set':
      if (key) {
        setCookie({
          key,
          value,
          domain,
          expires,
          secure,
          path,
          asJson,
        })
      }
      break
    // case 'push':
    //   const original = getCookieAsArray(key)
    //   original.push(value)
    //   setCookie(key, original, expires, true)
    //   break
    case 'remove':
      Cookies.remove(key)
  }

  let cookieData = undefined
  if (method !== 'remove') {
    cookieData = getCookie({ key, asJson })
  }

  if (typeof callback === 'function') {
    callback({ dispatch, getState, cookieData })
  }

  if (actionType) {
    const transformedAction = omit({
      ...action,
      type: actionType,
      cookieData,
    }, COOKIE_STORAGE)
    dispatch(transformedAction)
  }
}

// function getCookieAsArray(key) {
//   const raw = getCookie(key)
//   let parsed
//   try {
//     parsed = JSON.parse(raw)
//   } catch (e) {
//     parsed = raw || []
//   }
//   return Array.isArray(parsed) ? parsed : [parsed]
// }
