import got from "got";
import {HTTP_BASE_URL, HTTPS_BASE_URL, PATH} from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel";

const benchmarkModels: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            got(`${HTTP_BASE_URL}${PATH}`).then( () => {
                defer.resolve();
            })
        },
        target: "[got] http [GET]",
        defer: true,
    },
    {
        fn: (defer: any) => {
            got(`${HTTPS_BASE_URL}${PATH}`).then( () => {
                defer.resolve();
            });
        },
        target: "[got] https [GET]",
        defer: true,
    },
];

export default benchmarkModels;
