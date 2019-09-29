import Client from "../src/";
import { BenchmarkModel } from "./types/benchmarkModel";
import * as _constants from "./_constants";
import {responseType, Protocol} from "../src/types/options";

const client = new Client();
const opts = {
    host: _constants.HOST,
    path: _constants.PATH,
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
        defer: true,
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
