import Cookies from 'js-cookie'
import has from 'has'

type GetCookie = {
  key?: string,
  asJson: boolean,
}

const getCookie = (param: GetCookie) => {
  const { key, asJson } = param
  const rawValue = has(param, 'key')
    ? Cookies.get(key)
    : Cookies.get()
  let value = rawValue
  if (asJson) {
    try {
      value = JSON.parse(rawValue)
    } catch (e) {}
  }
  return value
}

export default getCookie
