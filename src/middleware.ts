import Cookies from 'js-cookie'
import setCookie from './setCookie'
import getCookie from './getCookie'

export const COOKIE_STORAGE = Symbol('COOKIE_STORAGE')

type ReduxStore = {
  dispatch: Function,
  getState: Function,
}

type Methods = 'get' | 'set' | 'push' | 'remove'
type ReduxActionType = Symbol | string

type Operation = {
  method: Methods,
  key?: string,
  value?: any,
  actionType?: ReduxActionType,
  domain?: string,
  expires?: number,
  secure?: boolean,
  path?: string,
  asJson?: boolean,
  callback?: Function,
}

type ReduxAction = {
  [COOKIE_STORAGE]?: Operation,
}

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

  const cookieData = getCookie({ key, asJson })

  if (typeof callback === 'function') {
    callback({ dispatch, getState, cookieData })
  }

  if (actionType) {
    const transformedAction = transformToAction({
      action,
      type: actionType,
      cookieData,
    })
    dispatch(transformedAction)
  }
}

type TransformToAction = {
  action: ReduxAction,
  type: ReduxActionType,
  cookieData: any,
}

const transformToAction = ({ action, type, ...payload }: TransformToAction) => {
  const clonedAction = { ...action }
  delete clonedAction[COOKIE_STORAGE]
  return {
    ...clonedAction,
    type,
    ...payload,
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
