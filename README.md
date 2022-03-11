# ChainLink 节点部署

> oneswap 适配器是单独写的，从 OneSwap 市场 API 获取价格
> 已经在正式服务器配置为 docker 环境

## 部署

> 每个币对需要一个 Aggregator，Oracle 地址就是 Chainlink 后端节点的对应地址，Admin 地址可以获取 Oracle 的报酬（如果报酬为 0 的，这个地址意义不大）
> decimals 设置成跟 Chainlink 报价任务相同即可
> 注意 min max 为报价最小最大值，超过的话链上合约不会接受

* 部署 Chainlink 节点
* 部署 Flags (默认报价偏离 5% 会 raiseFlag，可以搭配链下监控服务使用) `npx hardhat deployLibs --network <网络>`
* 编辑 `hardhat.config.js` 配置网络 RPC 等信息
* 部署单个 Aggregator `npx hardhat deployAggregator --admin 0xA4ff8Eb9F7331C2E93E60c5a2Cf5D694AC0f2811 --decimals 18 --description "ETH / USD" --max 100 --min 10 --oracle 0xA4ff8Eb9F7331C2E93E60c5a2Cf5D694AC0f2811 --link 0x5FbDB2315678afecb367f032d93F642f64180aa3 --validator 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 --network <网络>`

## 基本合约

* LinkToken 作为链下节点提供服务的奖励

## Request & Response 模型

> [Basic Request Model - Chainlink Docs](https://docs.chain.link/docs/architecture-request-model/)

* Oracle 链下节点提交数据到该合约，该合约回调至请求方
* APIConsumer 传递参数并请求 Oracle，Oracle 包装参数并发出事件，链下节点监听事件并做响应

## FluxAggregator 模型

> [Decentralized Data Model - Chainlink Docs](https://docs.chain.link/docs/architecture-decentralized-model/)

> 链下节点通过 [fluxmonitor](https://docs.chain.link/docs/architecture-decentralized-model/) 搭配 [Bridge](https://docs.chain.link/docs/node-operators/) 聚合多个数据源的响应，根据预设的条件决定是否触发上链操作

* FluxAggregator 链下节点聚合后直接提交到该合约，每轮按预设条件聚合多个节点的 Answer。

### Validator

> FluxAggregator 会在收到节点响应时调用 validate 方法，用户可以自定义。

* DeviationFlaggingValidator 数据值波动过大时，变更对应的 Flags 状态，可进一步结合链下节点进行对应处理。
* Flags
* SimpleReadAccessController
