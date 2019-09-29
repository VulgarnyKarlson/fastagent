import Client from "../src/";
import { HOST, PATH } from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel";

const client = new Client();

const benchmarkModels: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            client.makeRequest({ host: HOST, path: PATH, protocol: "http:", responseType: "empty" }).then( () => {
                defer.resolve();
            })
        },
        target: "[fastagent] http [GET]",
        defer: true,
    },
    {
        fn: (defer: any) => {
            client.makeRequest({ host: HOST, path: PATH, protocol: "https:", responseType: "empty" }).then( () => {
                defer.resolve();
            });
        },
        target: "[fastagent] https [GET]",
        defer: true,
    },
];

export default benchmarkModels;
