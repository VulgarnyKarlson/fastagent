import Client from "../src/";
import {HTTP_BASE_URL, PATH} from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel";

const client = new Client();

const benchmarkModels: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            client.get(`${HTTP_BASE_URL}${PATH}`).then( () => {
                defer.resolve();
            })
        },
        target: "[fastagent] http [GET]",
        defer: true,
    },
    {
        fn: (defer: any) => {
            client.get(`${HTTP_BASE_URL}${PATH}`).then( () => {
                defer.resolve();
            });
        },
        target: "[fastagent] https [GET]",
        defer: true,
    },
];

export default benchmarkModels;
