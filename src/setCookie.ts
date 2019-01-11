import Cookies from 'js-cookie'
import has from 'has'
import omitBy from 'lodash.omitby'

type SetCookie = {
  key: string
  value: any
  expires?: number
  domain?: string
  secure?: boolean
  path?: string
  asJson?: boolean
}

const setCookie = (param: SetCookie) => {
  const { key, value: rawValue, expires, domain, secure, path, asJson } = param
  const option = omitBy(
    {
      domain,
      expires,
      secure,
      path,
    },
    (value: any, key: any) => !hasCheck(param, key),
  )
  const value = asJson ? JSON.stringify(rawValue) : rawValue
  const args = [key, value]
  if (Object.keys(option).length > 0) {
    args.push(option)
  }
  Cookies.set(...args)
}

const hasCheck = (obj: object, key: any) => has(obj, key)

export default setCookie
