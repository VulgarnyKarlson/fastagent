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

[fastagent] http empty response [GET] x 19,351 ops/sec ±6.33% (181 runs sampled)
[fastagent] http empty response with url.parse [GET] x 14,802 ops/sec ±1.55% (178 runs sampled)
[fastagent] https empty response [GET] x 18,810 ops/sec ±2.27% (175 runs sampled)
[fastagent] http binary response [GET] x 16,160 ops/sec ±2.16% (176 runs sampled)
[fastagent] https binary response [GET] x 16,505 ops/sec ±1.87% (176 runs sampled)
[core] http [GET] x 23,690 ops/sec ±1.40% (179 runs sampled)
[core] https [GET] x 23,525 ops/sec ±1.61% (179 runs sampled)
[superagent] http [GET] x 10,391 ops/sec ±3.50% (180 runs sampled)
[superagent] https [GET] x 10,377 ops/sec ±2.47% (175 runs sampled)
[request] http [GET] x 9,748 ops/sec ±4.57% (182 runs sampled)
[request] https [GET] x 9,982 ops/sec ±0.86% (182 runs sampled)
[axios] http [GET] x 8,001 ops/sec ±4.81% (173 runs sampled)
[axios] https [GET] x 8,986 ops/sec ±1.66% (175 runs sampled)
[got] http [GET] x 3,128 ops/sec ±3.21% (179 runs sampled)
[got] https [GET] x 3,179 ops/sec ±1.96% (176 runs sampled)
Benchmark done
```
## License

[MIT](LICENSE) © Ibragim Zubailov
# 
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
