import zlib from "zlib";
import Client from "../src/index";
import * as prep from "./prepareNock";

const data = {
    firstName: 'Doctor',
    lastName: 'Mambo',
    emailAddr: 'Doctor@Mambo.com'
};

test("should support transparent gunzip", (done) => {
    const client = new Client({
        maxResponseSize: 1,
        responseType: "application/json",
    });
    prep.setupNock(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        }
    });
    client.get({
        uri: prep.HTTP_BASE_URL,
        path: prep.PATH,
    }, (res) => {
        expect(res.statusMessage).toEqual("Maximum response size reached");
        done();
    });
});
