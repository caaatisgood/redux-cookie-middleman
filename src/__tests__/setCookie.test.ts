import Cookies from 'js-cookie'
import setCookie from '../setCookie'

jest.mock('js-cookie', () => ({
  set: jest.fn()
}))

describe('#setCookie', () => {
  const key = 'cookie-key'
  const value = 'cookie-value'

  it('should call `set` of js-cookie with key and value', () => {
    setCookie({ key, value })
    expect(Cookies.set).toHaveBeenCalledWith(
      key,
      value,
    )
  })

  describe('when asJson is true', () => {
    it('should call `set of js-cookie with key and stringified value', () => {
      setCookie({ key, value, asJson: true })
      expect(Cookies.set).toHaveBeenCalledWith(
        key,
        JSON.stringify(value),
      )
    })
  })

  describe('when option configured', () => {
    it('should call `set` of js-cookie with key, value and option', () => {
      const option = {
        expires: 365,
        domain: 'codementor.io',
        secure: true,
        path: '/path',
      }
      setCookie({
        key,
        value,
        ...option
      })
      expect(Cookies.set).toHaveBeenCalledWith(
        key,
        value,
        option,
      )
    })
  })
})
