import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { Config, ExecuteWithConfig, InputParameters, AdapterResponse } from '@chainlink/types'
import { NAME as AdapterName } from '../config'

// This should be filled in with a lowercase name corresponding to the API endpoint
export const supportedEndpoints = ['market']

export const endpointResultPaths = {
  market: 'price',
}

export interface ResponseSchema {
  code: number,
  data: {
    active_address_num: number
    amount: string
    close: string
    exchange_percent: string
    high: string
    is_airdrop_market: string
    low: string
    market_contract: string
    money_contract: string
    money_decimals: number
    money_logo_url: string
    money_name: string
    money_symbol: string
    only_swap: boolean
    open: string
    price: string
    stock_contract: string
    stock_decimals: number
    stock_logo_url: string
    stock_name: string
    stock_symbol: string
    transactions: number
    volume: string
  }
}

const customError = (data: any) => data.Response === 'Error'

const getCETBasedEthPrice = async(jobRunID: string) => {
  const defaultConfig = Requester.getDefaultConfig('')
  defaultConfig.api.baseURL = 'http://localhost:8100'
  defaultConfig.api.method = 'post'

  const data = {
    id: jobRunID,
    data: { base: 'CET', quote: 'ETH', endpoint: 'price' },
  }
  const response = await Requester.request<AdapterResponse>({
    ...defaultConfig.api,
    data,
  })
  return response.data.result
}

export const inputParameters: InputParameters = {
  base: ['base', 'from', 'coin'],
  quote: ['quote', 'to', 'market'],
  resultPath: false,
}

export const execute: ExecuteWithConfig<Config> = async (request, config) => {
  const validator = new Validator(request, inputParameters)
  if (validator.error) throw validator.error

  const jobRunID = validator.validated.id
  const base = validator.overrideSymbol(AdapterName)
  const url = `/market/` + base
  const resultPath = validator.validated.data.resultPath

  const options = { ...config.api, url }

  const response = await Requester.request<ResponseSchema>(options, customError)
  const cetBasedPrice = Requester.validateResultNumber(response.data, ["data", resultPath])

  const ethBasedPrice = await getCETBasedEthPrice(jobRunID)
  const result = cetBasedPrice * ethBasedPrice

  return Requester.success(jobRunID, Requester.withResult(response, result), config.verbose)
}
