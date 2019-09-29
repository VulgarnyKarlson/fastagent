#fastagent
> Node.js module for highload projects, writed on typescript


## Table of Contents

* [Install](#install)
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

## Benchmarks
```text
[fastagent] http [GET] x 13,249 ops/sec ±7.87% (77 runs sampled)
[fastagent] https [GET] x 12,418 ops/sec ±5.10% (78 runs sampled)
[core] http [GET] x 21,185 ops/sec ±7.40% (78 runs sampled)
[core] https [GET] x 22,159 ops/sec ±0.59% (85 runs sampled)
[axios] http [GET] x 7,557 ops/sec ±6.17% (76 runs sampled)
[axios] https [GET] x 7,858 ops/sec ±4.32% (77 runs sampled)
[superagent] http [GET] x 9,630 ops/sec ±5.43% (76 runs sampled)
[superagent] https [GET] x 9,917 ops/sec ±2.71% (82 runs sampled)
[request] http [GET] x 8,414 ops/sec ±5.81% (77 runs sampled)
[request] https [GET] x 8,616 ops/sec ±2.17% (84 runs sampled)
Benchmark done
```
## License

[MIT](LICENSE) © Ibragim Zubailov
# 
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
