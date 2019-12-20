import zlib from "zlib";
import Client from "../src/index";
import * as prep from "./prepareNock";

const data = {
    firstName: 'Doctor',
    lastName: 'Mambo',
    emailAddr: 'Doctor@Mambo.com'
};

test("should support transparent gunzip", (done) => {
    const client = new Client();
    prep.setupNock(zlib.gzipSync(JSON.stringify(data)), {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Content-Encoding": "gzip",
        }
    });
    client.get({
        uri: prep.HTTP_BASE_URL,
        path: prep.PATH,
        responseType: "application/json",
    }, (res) => {
        expect(data).toEqual(res.raw);
        done();
    });
});

test("should return buffer on unsuccessfull gunzip", (done) => {
    const client = new Client();
    prep.setupNock("nothing", {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Content-Encoding": "gzip",
        }
    });
    client.get({
        uri: prep.HTTP_BASE_URL,
        path: prep.PATH,
        responseType: "application/json",
    }, (res) => {
        expect(res.raw as any instanceof Buffer).toBe(true);
        done();
    });
});
