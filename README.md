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

[fastagent] http empty response [GET] x 16,012 ops/sec ±6.81% (128 runs sampled)
[fastagent] https empty response [GET] x 15,531 ops/sec ±3.09% (121 runs sampled)
[fastagent] http binary response [GET] x 14,060 ops/sec ±2.46% (123 runs sampled)
[fastagent] https binary response [GET] x 14,250 ops/sec ±1.74% (126 runs sampled)
[core] http [GET] x 22,601 ops/sec ±3.53% (126 runs sampled)
[core] https [GET] x 22,413 ops/sec ±1.08% (127 runs sampled)
[got] http [GET] x 2,799 ops/sec ±4.84% (124 runs sampled)
[got] https [GET] x 3,141 ops/sec ±1.53% (127 runs sampled)
[axios] http [GET] x 7,672 ops/sec ±4.74% (119 runs sampled)
[axios] https [GET] x 7,983 ops/sec ±2.62% (123 runs sampled)
[superagent] http [GET] x 10,786 ops/sec ±3.41% (130 runs sampled)
[superagent] https [GET] x 11,474 ops/sec ±0.94% (127 runs sampled)
[request] http [GET] x 8,804 ops/sec ±3.57% (130 runs sampled)
[request] https [GET] x 9,540 ops/sec ±1.01% (130 runs sampled)
Benchmark done
```
## License

[MIT](LICENSE) © Ibragim Zubailov
# 
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
