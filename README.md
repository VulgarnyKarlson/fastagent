# fastagent
> Node.js module for highload projects, written on typescript


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Benchmarks](#benchmarks)
* [License](#license)

## Install

[npm][]:

```sh
npm install fastagent
```

[yarn][]:

```sh
yarn add fastagent
```

## Usage
```js
import Client from "fastagent";
const client = new Client();

( () => {
    client.get({
        uri: "https://www.google.com",
        responseType: "text"
    }, console.log);
})();

```

## Benchmarks
```text
> node -r ts-node/register --max-old-space-size=4096 benchmark/index.ts

[core] http [GET] x 23,718 ops/sec ±6.20% (180 runs sampled)
[core] https [GET] x 21,763 ops/sec ±3.45% (180 runs sampled)
[fastagent] http empty response [GET] x 21,269 ops/sec ±1.48% (174 runs sampled)
[fastagent] https empty response [GET] x 19,905 ops/sec ±0.78% (179 runs sampled)
[fastagent] http empty response with url.parse [GET] x 14,545 ops/sec ±2.64% (173 runs sampled)
[fastagent] http binary response [GET] x 17,252 ops/sec ±1.26% (178 runs sampled)
[fastagent] https binary response [GET] x 16,766 ops/sec ±2.38% (174 runs sampled)
[superagent] http [GET] x 9,476 ops/sec ±5.54% (171 runs sampled)
[superagent] https [GET] x 9,998 ops/sec ±2.52% (175 runs sampled)
[request] http [GET] x 9,661 ops/sec ±1.85% (180 runs sampled)
[request] https [GET] x 8,907 ops/sec ±1.42% (179 runs sampled)
[axios] http [GET] x 7,725 ops/sec ±3.30% (173 runs sampled)
[axios] https [GET] x 7,551 ops/sec ±2.53% (169 runs sampled)
[got] http [GET] x 2,712 ops/sec ±3.42% (171 runs sampled)
[got] https [GET] x 2,851 ops/sec ±2.78% (173 runs sampled)
Benchmark done

```
## License

[MIT](LICENSE) © Ibragim Zubailov
# 
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
