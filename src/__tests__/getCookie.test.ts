import Cookies from 'js-cookie'
import getCookie from '../getCookie'

jest.mock('js-cookie', () => ({
  get: jest.fn()
}))

describe('#getCookie', () => {
  const key = 'cookie-key'
  const value = 'cookie-value'
  Cookies.get.mockReturnValue(value)

  beforeEach(() => {
    Cookies.get.mockClear()
  })

  it('should call get of js-cookie with key and return value', () => {
    const cookieData = getCookie({ key })
    expect(Cookies.get).toHaveBeenCalledWith(key)
    expect(cookieData).toEqual(value)
  })

  it('should call get of js-cookie without args and return value', () => {
    const cookieData = getCookie()
    expect(Cookies.get).toHaveBeenCalledWith()
    expect(cookieData).toEqual(value)
  })

  describe('when asJson is true', () => {
    const asJson = true
    it('should call get of js-cookie with key and return parsed value', () => {
      const rawValue = { k: 'v' }
      const value = JSON.stringify(rawValue)
      Cookies.get.mockReturnValueOnce(value)
      const cookieData = getCookie({ key, asJson })
      expect(Cookies.get).toHaveBeenCalledWith(key)
      expect(cookieData).toEqual(rawValue)
    })

    it('should call get of js-cookie and return the value without parse error', () => {
      const rawValue = 'not parsable'
      Cookies.get.mockReturnValue(rawValue)
      expect(() => getCookie({ key, asJson })).not.toThrow()
      const cookieData = getCookie({ key, asJson })
      expect(Cookies.get).toHaveBeenCalledWith(key)
      expect(cookieData).toEqual(rawValue)
    })
  })
})