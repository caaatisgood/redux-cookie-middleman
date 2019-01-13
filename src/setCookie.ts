import Cookies from 'js-cookie'
import has from 'has'
import omitBy from 'lodash.omitby'

type SetCookie = {
  key: string
  value: any
  expires?: number | Date
  domain?: string
  secure?: boolean
  path?: string
  asJson?: boolean
}

type Option = {
  expires?: number | Date
  domain?: string
  secure?: boolean
  path?: string
}

const setCookie = (param: SetCookie) => {
  const { key, value: rawValue, expires, domain, secure, path, asJson } = param
  const option: Option = omitBy(
    {
      domain,
      secure,
      path,
    },
    (value: any, key: any) => !hasCheck(param, key),
  )
  if (has(param, 'expires')) {
    option.expires = expires === Infinity
      ? new Date('9999-12-31T23:59:59.000Z')
      : expires
  }

  const value = asJson ? JSON.stringify(rawValue) : rawValue
  const args = [key, value]
  if (Object.keys(option).length > 0) {
    args.push(option)
  }
  Cookies.set(...args)
}

const hasCheck = (obj: object, key: any) => has(obj, key)

export default setCookie
