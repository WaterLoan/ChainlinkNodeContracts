# Chainlink External Adapter for OneSwap

A template to be used as an example for new [External Adapters](https://github.com/smartcontractkit/external-adapters-js)

(please fill out with corresponding information)

Query infomation from [OneSwap's API](https://github.com/oneswap/oneswap_open_api/blob/master/api-zh.md)

### Input Parameters

| Required? |   Name   |     Description     |           Options            | Defaults to |
| :-------: | :------: | :-----------------: | :--------------------------: | :---------: |
|           | endpoint | The endpoint to use | [market](#Market-Endpoint) |   market   |

---

## Market Endpoint

### Input Params

| Required? |            Name            |               Description                |       Options       | Defaults to |
| :-------: | :------------------------: | :--------------------------------------: | :-----------------: | :---------: |
|    ✅     | `base`, `from`, or `coin`  | The address of market contract to query | ``0xFe103eDD7F98fc020575CBf0dE787dB26dE864A4 |             |
|    ✅     | `quote`, `to`, or `market` | Anything in string | `dummy` |             |

### Sample Input

```json
{
  "id": "1",
  "data": {
    "base": "0xFe103eDD7F98fc020575CBf0dE787dB26dE864A4",
    "quote": "dummy"
  }
}
```

### Sample Output

```json
{
  "jobRunID": "278c97ffadb54a5bbb93cfec5f7b5503",
  "data": {
    "price": 77777.77,
    "result": 77777.77
  },
  "statusCode": 200
}
```
