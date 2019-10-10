import nock from "nock";
import Client from "./";
import {HttpStatus} from "./";

nock("http://benchmark.io")
    .persist()
    .get("/")
    .delayConnection(1000)
    .reply(200, { message: HttpStatus[HttpStatus.ETIMEDOUT] });
const client = new Client();

( () => {
    client.get({
        uri: "http://benchmark.io",
        responseType: "text",
        timeout: 6000,
    }, console.log);
})();
