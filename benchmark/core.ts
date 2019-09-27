import {BenchmarkModel} from "./types/benchmarkModel";
import * as http from "http";
import * as _constants from "./_constants";
import * as https from "https";

const benchmarkModel: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            http.request({ host: _constants.HOST, path: _constants.PATH }, (res) => {
                res.resume().on("end", () => defer.resolve());
            }).end();
        },
        target: "[core] http [GET]"
    },
    {
        fn: (defer: any) => {
            https.request({ host: _constants.HOST, path: _constants.PATH }, (res) => {
                res.resume().on("end", () => defer.resolve());
            }).end();
        },
        target: "[core] https [GET]"
    }
];

export default benchmarkModel;
