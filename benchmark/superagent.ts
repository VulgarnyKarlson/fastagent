const superagent = require('superagent');
import { HTTP_BASE_URL, HTTPS_BASE_URL, PATH } from "./_constants";
import { BenchmarkModel } from "./types/benchmarkModel"

const httpUrl = HTTP_BASE_URL + PATH;
const httpsUrl = HTTPS_BASE_URL + PATH;
const benchmarkModels: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            superagent.get(httpUrl).then( () => {
                defer.resolve()
            });
        },
        target: "[superagent] http [GET]",
    },
    {
        fn: (defer: any) => {
            superagent.get(httpsUrl).then( () => {
                defer.resolve()
            });
        },
        target: "[superagent] https [GET]",
    },
];

export default benchmarkModels;
