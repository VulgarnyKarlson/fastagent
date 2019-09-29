import Benchmark, { Event } from "benchmark";
import nock from "nock";
import {
    HTTP_BASE_URL,
    HTTPS_BASE_URL,
    PATH,
    RESPONSE_BODY,
} from "./_constants";
import coreModels from "./core";
import fastAgent from "./fastagent";
import axios from "./axios";
import superagent from "./superagent";
import request from "./request";

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
    ... fastAgent,
    ... coreModels,
    ... axios,
    ... superagent,
    ... request,
];

models.forEach((model) => {
    suite.add(model.target, {
        defer: true,
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
