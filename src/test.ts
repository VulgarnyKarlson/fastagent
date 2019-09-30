import Client from "./";
import nock from "nock";
import {HttpStatus} from "./";

nock("http://benchmark.io")
    .persist()
    .get("/")
    .delayConnection(9000)
    .replyWithError({ message: HttpStatus[HttpStatus.ETIMEDOUT] });


const client = new Client();

( async() => {
    client.get({
        uri: "http://benchmark.io",
        responseType: "text",
        fakeTimeout: 1500,
        timeout: 6000,
    }, console.log);
})();
