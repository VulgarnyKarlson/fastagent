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

[fastagent] http empty response [GET] x 18,845 ops/sec ±5.63% (180 runs sampled)
[fastagent] https empty response [GET] x 18,959 ops/sec ±2.18% (176 runs sampled)
[fastagent] http binary response [GET] x 16,369 ops/sec ±2.80% (173 runs sampled)
[fastagent] https binary response [GET] x 15,825 ops/sec ±1.65% (177 runs sampled)
[core] http [GET] x 23,320 ops/sec ±2.96% (176 runs sampled)
[core] https [GET] x 23,823 ops/sec ±1.03% (181 runs sampled)
[superagent] http [GET] x 10,227 ops/sec ±4.17% (173 runs sampled)
[superagent] https [GET] x 10,811 ops/sec ±3.22% (173 runs sampled)
[request] http [GET] x 10,062 ops/sec ±2.34% (182 runs sampled)
[request] https [GET] x 9,789 ops/sec ±1.28% (180 runs sampled)
[axios] http [GET] x 8,200 ops/sec ±2.89% (169 runs sampled)
[axios] https [GET] x 8,388 ops/sec ±2.74% (175 runs sampled)
[got] http [GET] x 2,993 ops/sec ±3.47% (175 runs sampled)
[got] https [GET] x 3,215 ops/sec ±2.73% (173 runs sampled)
Benchmark done
```
## License

[MIT](LICENSE) © Ibragim Zubailov
# 
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
