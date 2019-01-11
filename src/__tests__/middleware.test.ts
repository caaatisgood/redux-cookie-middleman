import { mocked } from 'ts-jest'
import Cookies from 'js-cookie'
import omit from 'lodash.omit'
import middleware, { COOKIE_STORAGE } from '../middleware'
import {
  ReduxAction,
  Operation
} from '../types'
import _getCookie from '../getCookie'
import _setCookie from '../setCookie'

jest.mock('../getCookie')
jest.mock('../setCookie')
jest.mock('js-cookie', () => ({
  remove: jest.fn()
}))

const getCookie = mocked(_getCookie, true)
const setCookie = mocked(_setCookie, true)

describe('#middleware', () => {
  const key = 'cookie-key'
  const value = 'cookie-value'
  const domain = '.codementor.io'
  const expires = 365
  const secure = true
  const path = '/path'
  let dispatch = jest.fn()
  let getState = jest.fn()
  let next = jest.fn()
  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
    next = jest.fn()
    jest.clearAllMocks()
  })

  const perform = (action: ReduxAction) => {
    middleware({ dispatch, getState })(next)(action)
  }
  const getAction = (operation: Operation): ReduxAction => ({
    [COOKIE_STORAGE]: operation,
  })

  it('should call next with action if cookie operation does not exist', () => {
    const action: ReduxAction = { type: 'not-for-this-middleware' }
    perform(action)
    expect(next).toHaveBeenCalledWith(action)
  })

  describe('operation with `get` method', () => {
    it('should call getCookie', () => {
      const asJson = true
      const param = {
        asJson,
        key,
      }
      const action: ReduxAction = getAction({
        method: 'get',
        ...param,
      })
      perform(action)
      expect(getCookie).toHaveBeenCalledWith(param)
    })

    it('should call getCookie with asJson false by default', () => {
      const action: ReduxAction = getAction({
        method: 'get',
        key,
      })
      perform(action)
      expect(getCookie).toHaveBeenCalledWith({ key, asJson: false })
    })

    it('should call callback if', () => {

    })
  })

  describe('operation with `set` method', () => {
    it('should call setCookie and getCookie', () => {
      const asJson = true
      const setParam = {
        key,
        value,
        domain,
        expires,
        secure,
        path,
        asJson,
      }
      const getParam = {
        key,
        asJson,
      }
      const action: ReduxAction = getAction({
        method: 'set',
        ...setParam,
      })
      perform(action)
      expect(setCookie).toHaveBeenCalledWith(setParam)
      expect(getCookie).toHaveBeenCalledWith(getParam)
    })

    it('should call setCookie with asJson false by default', () => {
      const setParam = {
        key,
        value,
        domain,
        expires,
        secure,
        path,
      }
      const getParam = {
        key,
        asJson: false,
      }
      const action: ReduxAction = getAction({
        method: 'set',
        ...setParam,
      })
      perform(action)
      expect(setCookie).toHaveBeenCalledWith({
        ...setParam,
        asJson: false,
      })
      expect(getCookie).toHaveBeenCalledWith(getParam)
    })
  })

  describe('operation with `remove` method', () => {
    it('should call Cookies.remove and wont call getCookie', () => {
      const action: ReduxAction = getAction({
        method: 'remove',
        key,
      })
      perform(action)
      expect(Cookies.remove).toHaveBeenCalledWith(key)
      expect(getCookie).not.toHaveBeenCalled()
    })
  })

  describe('operation callback', () => {
    let allKindsOfOperation
    beforeEach(() => {
      allKindsOfOperation = [
        getAction({
          method: 'get',
          key,
          callback: jest.fn()
        }),
        getAction({
          method: 'set',
          key,
          value,
          callback: jest.fn()
        }),
        getAction({
          method: 'remove',
          key,
          callback: jest.fn()
        })
      ]
    })
    it('should be called if specified in get operation', () => {
      const cookieData = 'cookie-value'
      getCookie.mockReturnValueOnce(cookieData)
      const callback = jest.fn()
      const action = getAction({
        method: 'get',
        key,
        callback,
      })
      perform(action)
      expect(callback).toHaveBeenCalledWith({
        dispatch,
        getState,
        cookieData,
      })
    })

    it('should be called if specified in set operation', () => {
      const cookieData = 'cookie-value'
      getCookie.mockReturnValueOnce(cookieData)
      const callback = jest.fn()
      const action = getAction({
        method: 'set',
        key,
        value: cookieData,
        callback,
      })
      perform(action)
      expect(callback).toHaveBeenCalledWith({
        dispatch,
        getState,
        cookieData,
      })
    })

    it('should be called if specified in remove operation', () => {
      const callback = jest.fn()
      const action = getAction({
        method: 'remove',
        key,
        callback,
      })
      perform(action)
      expect(callback).toHaveBeenCalledWith({
        dispatch,
        getState,
        cookieData: undefined,
      })
    })
  })

  describe('transformed action dispatching', () => {
    it('should not dispatch if actionType is not specified', () => {
      const action: ReduxAction = getAction({ method: 'get' })
      perform(action)
      expect(dispatch).not.toHaveBeenCalled()
    })

    it('should dispatch if actionType is specified in get operation', () => {
      const cookieData = 'cookie-value'
      getCookie.mockReturnValueOnce(cookieData)
      const actionType = 'after-cookie-operation'
      const extraPayload = { k: 'v' }
      const action: ReduxAction = getAction({
        method: 'get',
        actionType,
        ...extraPayload,
      })
      perform(action)
      expect(dispatch).toHaveBeenCalledWith(omit({
        ...action,
        type: actionType,
        cookieData,
      }, COOKIE_STORAGE))
    })

    it('should dispatch if actionType is specified in set operation', () => {
      const cookieData = 'cookie-value'
      getCookie.mockReturnValueOnce(cookieData)
      const actionType = 'after-cookie-operation'
      const extraPayload = { k: 'v' }
      const action: ReduxAction = getAction({
        method: 'set',
        key,
        value,
        actionType,
        ...extraPayload,
      })
      perform(action)
      expect(dispatch).toHaveBeenCalledWith(omit({
        ...action,
        type: actionType,
        cookieData,
      }, COOKIE_STORAGE))
    })

    it('should dispatch if actionType is specified in remove operation', () => {
      const actionType = 'after-cookie-operation'
      const extraPayload = { k: 'v' }
      const action: ReduxAction = getAction({
        method: 'remove',
        key,
        actionType,
        ...extraPayload,
      })
      perform(action)
      expect(dispatch).toHaveBeenCalledWith(omit({
        ...action,
        type: actionType,
        cookieData: undefined,
      }, COOKIE_STORAGE))
    })
  })
})
