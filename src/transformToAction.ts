import {
  ReduxAction,
  ReduxActionType
} from './types'
import { COOKIE_STORAGE } from './'

export type TransformToAction = {
  action: ReduxAction,
  type: ReduxActionType,
  cookieData: any,
}

const transformToAction = ({ action, type, ...payload }: TransformToAction): object => {
  const clonedAction = { ...action }
  delete clonedAction[COOKIE_STORAGE]
  return {
    ...clonedAction,
    type,
    ...payload,
  }
}

export default transformToAction
