import * as Client from "../src/index";
import * as prep from "./prepareNock";

const data = {
    firstName: "Doctor",
    lastName: "Mambo",
    emailAddr: "Doctor@Mambo.com",
};

test("should support transparent gunzip", (done) => {
    const client = Client.getClient("undici", {
        maxResponseSize: 1,
        responseType: "application/json",
    });
    prep.setupNock(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        },
    });
    client.makeRequest({
        uri: prep.HTTP_BASE_URL,
        method: "GET",
        protocol:"http",
        path: prep.PATH,
    }, (res) => {
        expect(res.statusMessage).toEqual("Maximum response size reached");
        done();
    });
});
