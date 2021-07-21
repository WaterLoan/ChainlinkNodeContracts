import { Requester } from '@chainlink/ea-bootstrap'
import { Config } from '@chainlink/types'

export const NAME = 'ONESWAP' 

export const DEFAULT_ENDPOINT = 'market'
export const DEFAULT_BASE_URL = 'https://www.oneswap.net/api/cet'

export const makeConfig = (prefix?: string): Config => {
  const config = Requester.getDefaultConfig(prefix)

  config.api.baseURL = config.api.baseURL || DEFAULT_BASE_URL
  config.defaultEndpoint = DEFAULT_ENDPOINT
  return config
}
