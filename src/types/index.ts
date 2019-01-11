import { COOKIE_STORAGE } from '../'

export type ReduxStore = {
  dispatch: Function,
  getState: Function,
}

export type Methods = 'get' | 'set' | 'push' | 'remove'
export type ReduxActionType = Symbol | string

export type Operation = {
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

export type ReduxAction = {
  [COOKIE_STORAGE]?: Operation,
  type?: ReduxActionType
}
