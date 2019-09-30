import Client from "./";
import nock from "nock";

nock("http://benchmark.io")
    .persist()
    .get("/")
    .delayConnection(1000)
    .reply(200, "hello");

const client = new Client();

( async() => {
    client.get({
        uri: "http://benchmark.io",
        responseType: "text",
        timeout: 1500
    }, console.log);
})();
