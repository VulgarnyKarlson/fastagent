import axios from "axios";
import { HTTP_BASE_URL, HTTPS_BASE_URL, PATH } from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel";

const benchmarkModels: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            axios.get(`${HTTP_BASE_URL}${PATH}`).then( () => {
                defer.resolve();
            })
        },
        target: "[axios] http [GET]",
        defer: true,
    },
    {
        fn: (defer: any) => {
            axios.get(`${HTTPS_BASE_URL}${PATH}`).then( () => {
                defer.resolve();
            });
        },
        target: "[axios] https [GET]",
        defer: true,
    },
];

export default benchmarkModels;
