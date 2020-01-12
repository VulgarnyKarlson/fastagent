import Client, {Protocol, responseType} from "../src/";
import { HOST, HTTP_BASE_URL, PATH} from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel";

const client = new Client();
const opts = {
    host: HOST,
    path: PATH,
};

const httpOptsEmpty = { ... opts, protocol: "http:" as Protocol, responseType: "empty" as responseType };
const httpsOptsEmpty = { ... opts, protocol: "https:" as Protocol, responseType: "empty" as responseType };
const httpOptsBinary = { ... opts, protocol: "http:" as Protocol, responseType: "binary" as responseType };
const httpsOptsBinary = { ... opts, protocol: "https:" as Protocol, responseType: "binary" as responseType };

const benchmarkModels: BenchmarkModel[] = [

    {
        fn: (defer: any) => {
            client.get(httpOptsEmpty, () => defer.resolve());
        },
        target: "[fastagent] http empty response [GET]",
    },
    {
        fn: (defer: any) => {
            client.get(httpsOptsEmpty, () => defer.resolve());
        },
        target: "[fastagent] https empty response [GET]",
        defer: true,
    },
    {
        fn: (defer: any) => {
            client.get({ uri: `${HTTP_BASE_URL}${PATH}`, responseType: "empty"}, () => defer.resolve());
        },
        target: "[fastagent] http empty response with url.parse [GET]",
        defer: true,
    },
    {
        fn: (defer: any) => {
            client.get(httpOptsBinary, () => defer.resolve());
        },
        target: "[fastagent] http binary response [GET]",
        defer: true,
    },
    {
        fn: (defer: any) => {
            client.get(httpsOptsBinary, () => defer.resolve());
        },
        target: "[fastagent] https binary response [GET]",
        defer: true,
    },
];

export default benchmarkModels;

/*

[fastagent] http empty response [GET] x 17,768 ops/sec ±9.34% (178 runs sampled)
[fastagent] http empty response with url.parse [GET] x 13,374 ops/sec ±1.35% (178 runs sampled)
[fastagent] https empty response [GET] x 16,996 ops/sec ±3.84% (168 runs sampled)
[fastagent] http binary response [GET] x 15,629 ops/sec ±1.68% (175 runs sampled)
[fastagent] https binary response [GET] x 16,150 ops/sec ±2.07% (179 runs sampled)
[core] http [GET] x 24,186 ops/sec ±2.20% (181 runs sampled)
[core] https [GET] x 24,361 ops/sec ±0.48% (180 runs sampled)
[superagent] http [GET] x 9,795 ops/sec ±3.27% (177 runs sampled)
[superagent] https [GET] x 9,586 ops/sec ±2.87% (174 runs sampled)
[request] http [GET] x 9,210 ops/sec ±3.01% (181 runs sampled)
[request] https [GET] x 9,431 ops/sec ±1.29% (180 runs sampled)
[axios] http [GET] x 7,552 ops/sec ±3.46% (170 runs sampled)
[axios] https [GET] x 7,583 ops/sec ±2.49% (173 runs sampled)
[got] http [GET] x 2,807 ops/sec ±3.07% (174 runs sampled)
[got] https [GET] x 2,913 ops/sec ±2.88% (174 runs sampled)
Benchmark done

 */
