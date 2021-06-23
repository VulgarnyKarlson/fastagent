import zlib from "zlib";
import * as Client from "../src/index";
import * as prep from "./prepareNock";

const data = {
    firstName: "Doctor",
    lastName: "Mambo",
    emailAddr: "Doctor@Mambo.com",
};

test("should support transparent gunzip", (done) => {
    const client = Client.getClient("undici");
    prep.setupNock(zlib.gzipSync(JSON.stringify(data)), {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Content-Encoding": "gzip",
        },
    });
    client.makeRequest({
        uri: prep.HTTP_BASE_URL,
        path: prep.PATH,
        protocol:"http",
        method: "GET",
        responseType: "application/json",
    }, (res) => {
        expect(data).toEqual(res.raw);
        done();
    });
});

test("should return buffer on unsuccessfull gunzip", (done) => {
    const client = Client.getClient("undici");
    prep.setupNock("nothing", {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Content-Encoding": "gzip",
        },
    });
    client.makeRequest({
        uri: prep.HTTP_BASE_URL,
        path: prep.PATH,
        method: "GET",
        protocol:"http",
        responseType: "application/json",
    }, (res) => {
        expect(res.raw as any instanceof Buffer).toBe(true);
        done();
    });
});
