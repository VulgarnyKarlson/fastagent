import { getClient } from "../dist";
import {HttpMethod} from "../src/undici_module/interface";
import UndiciModule from "../src/undici_module/wrapper";
import { HOST, PATH} from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel";

const opts = {
    host: HOST,
    path: PATH,
};

const undiciOptions = {
    host: "127.0.0.1",
    protocol: "http",
    path: "/",
    method: HttpMethod.GET,
    requestTimeout: 1500,
};

const client = getClient("undici") as any;

const benchmarkModels: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            client
                .makeRequest(undiciOptions).then(() =>  defer.resolve());
        },
        target: "[Undici] http [GET]",
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
