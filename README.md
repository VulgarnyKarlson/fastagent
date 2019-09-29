#fastagent
> Node.js module for highload projects, writed on typescript


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
            .catch(console.log);
})();

```

## Benchmarks
```text
> node -r ts-node/register --max-old-space-size=4096 benchmark/index.ts

[fastagent] http [GET] x 14,984 ops/sec ±1.32% (83 runs sampled)
[fastagent] https [GET] x 14,093 ops/sec ±2.49% (80 runs sampled)
[core] http [GET] x 22,079 ops/sec ±6.48% (84 runs sampled)
[core] https [GET] x 22,036 ops/sec ±1.23% (88 runs sampled)
[axios] http [GET] x 7,294 ops/sec ±5.06% (75 runs sampled)
[axios] https [GET] x 7,335 ops/sec ±4.56% (76 runs sampled)
[superagent] http [GET] x 8,968 ops/sec ±6.92% (77 runs sampled)
[superagent] https [GET] x 9,577 ops/sec ±3.87% (80 runs sampled)
[request] http [GET] x 8,722 ops/sec ±4.02% (79 runs sampled)
[request] https [GET] x 8,717 ops/sec ±2.46% (82 runs sampled)
Benchmark done
```
## License

[MIT](LICENSE) © Ibragim Zubailov
# 
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
