import Client from "../src/";
import {Protocol, responseType} from "../src/types/options";
import * as _constants from "./_constants";
import {HTTP_BASE_URL} from "./_constants";
import {PATH} from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel";

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
    },    {
        fn: (defer: any) => {
            client.get({ uri: `${HTTP_BASE_URL}${PATH}`, responseType: "empty"}, () => defer.resolve());
        },
        target: "[fastagent] http empty response with url.parse [GET]",
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
