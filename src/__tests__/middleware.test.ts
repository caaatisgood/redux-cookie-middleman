import middleware, { COOKIE_STORAGE } from '../middleware'
import { ReduxAction } from '../types'
import getCookie from '../getCookie'

jest.mock('../getCookie')

describe('#middleware', () => {
  let dispatch = jest.fn()
  let getState = jest.fn()
  let next = jest.fn()
  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
    next = jest.fn()
  })

  const perform = (action: ReduxAction) => {
    middleware({ dispatch, getState })(next)(action)
  }

  it('should call next with action if cookie operation does not exist', () => {
    const action = { type: 'not-for-this-middleware' }
    perform(action)
    expect(next).toHaveBeenCalledWith(action)
  })

  it('should call getCookie when method is `get`', () => {
    const key = 'cookie-key'
    const asJson = true
    const action = {
      [COOKIE_STORAGE]: {
        method: 'get',
        asJson,
        key
      }
    }
    perform(action)
    expect(getCookie).toHaveBeenCalledWith({ asJson, key })
  })
})
