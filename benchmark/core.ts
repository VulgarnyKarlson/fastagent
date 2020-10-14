import * as http from "http";
import * as _constants from "./_constants";
import {BenchmarkModel} from "./types/benchmarkModel";

const benchmarkModel: BenchmarkModel[] = [
    {
        fn: (defer: any) => {
            http.request({ host: _constants.HOST, path: _constants.PATH }, (res) => {
                res.resume().on("end", () => defer.resolve());
            }).end();
        },
        target: "[core] http [GET]",
    },
];

export default benchmarkModel;
