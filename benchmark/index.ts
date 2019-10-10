import Benchmark from "benchmark";
import nock from "nock";
import {
    HTTP_BASE_URL,
    HTTPS_BASE_URL,
    PATH,
    RESPONSE_BODY,
} from "./_constants";
import axios from "./axios";
import coreModels from "./core";
import fastAgent from "./fastagent";
import got from "./got";
import request from "./request";
import superagent from "./superagent";

const suite = new Benchmark.Suite();

nock(HTTP_BASE_URL)
    .persist()
    .get(PATH)
    .reply(200, RESPONSE_BODY)
    .post(PATH)
    .reply(200, RESPONSE_BODY);

nock(HTTPS_BASE_URL)
    .persist()
    .get(PATH)
    .reply(200, RESPONSE_BODY)
    .post(PATH)
    .reply(200, RESPONSE_BODY);

const models = [
    ... coreModels,
    ... fastAgent,
    ... superagent,
    ... request,
    ... axios,
    ... got,
];

models.forEach((model) => {
    suite.add(model.target, {
        defer: true,
        minSamples: 100,
        fn: model.fn,
    });
});

suite
    .on("cycle", (event: Event) => {
        console.log(event.target.toString());
    })
    .on("complete", () => {
        console.log(`Benchmark done`);
    })
    .run({ async: true });
