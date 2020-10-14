import {getClient} from "./src";

const client = getClient("undici");

( (async) => {
    const res = await client.makeRequest({
            host: "billing.wpu.sh",
            path: "/api/v1/sources/ssp?key=CDF99F011EC3453C5616",
            headers,
            requestTimeout: 1500,
            protocol: "http",
            responseType: "application/json",
            method: "GET",
    });
    console.log(res);
})();
