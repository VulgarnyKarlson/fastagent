import Client from "../src/";
import { BenchmarkModel } from "./types/benchmarkModel";
import * as _constants from "./_constants";
import {responseType, Protocol} from "../src/types/options";

const client = new Client();
const opts = {
    host: _constants.HOST,
    path: _constants.PATH,
    responseType: "binary" as responseType
};
const httpOpts = { ... opts, protocol: "http:" as Protocol };
const httpsOpts = { ... opts, protocol: "https:" as Protocol };

const benchmarkModels: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            client.get(httpOpts, () => defer.resolve());
        },
        target: "[fastagent] http [GET]",
        defer: true,
    },
    {
        fn: (defer: any) => {
            client.get(httpsOpts, () => defer.resolve());
        },
        target: "[fastagent] https [GET]",
        defer: true,
    },
];

export default benchmarkModels;
