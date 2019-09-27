import request from "request";
import { HTTP_BASE_URL, HTTPS_BASE_URL } from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel";

const benchmarkModels: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            request.get(HTTP_BASE_URL, () => defer.resolve());
        },
        target: "[request] http [GET]",
    },
    {
        fn: (defer: any) => {
            request.get(HTTPS_BASE_URL, () => defer.resolve());
        },
        target: "[request] https [GET]",
    },
];

export default benchmarkModels;
