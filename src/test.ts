import Client from "./";
import nock from "nock";

nock("http://benchmark.io")
    .persist()
    .get("/")
    .delayConnection(10000)
    .reply(200, "hello");

const client = new Client();

( async() => {
    client.get({
        uri: "http://benchmark.io",
        responseType: "text",
        fakeTimeout: 1500,
        timeout: 6000,
    }, console.log);
})();
