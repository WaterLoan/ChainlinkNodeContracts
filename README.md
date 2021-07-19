# ChainLink 节点部署

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
