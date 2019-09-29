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

( async() => {
        client.get({ uri: "http://www.google.com", protocol: "http:"})
            .then(console.log)
            .catch(console.error);
})();

```

## Benchmarks
```text
> node -r ts-node/register --max-old-space-size=4096 benchmark/index.ts

[fastagent] http [GET] x 14,244 ops/sec ±1.62% (83 runs sampled)
[fastagent] https [GET] x 15,441 ops/sec ±1.12% (83 runs sampled)
[core] http [GET] x 23,129 ops/sec ±7.12% (82 runs sampled)
[core] https [GET] x 24,284 ops/sec ±0.59% (86 runs sampled)
[got] http [GET] x 2,584 ops/sec ±6.45% (76 runs sampled)
[got] https [GET] x 2,823 ops/sec ±3.81% (78 runs sampled)
[axios] http [GET] x 6,742 ops/sec ±6.73% (74 runs sampled)
[axios] https [GET] x 7,419 ops/sec ±2.40% (77 runs sampled)
[superagent] http [GET] x 10,324 ops/sec ±8.35% (77 runs sampled)
[superagent] https [GET] x 11,168 ops/sec ±1.58% (83 runs sampled)
[request] http [GET] x 8,225 ops/sec ±6.32% (76 runs sampled)
[request] https [GET] x 8,654 ops/sec ±1.28% (80 runs sampled)

Benchmark done
```
## License

[MIT](LICENSE) © Ibragim Zubailov
# 
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
