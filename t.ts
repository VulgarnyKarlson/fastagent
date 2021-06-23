import * as Client from "./src";

( async () => {
    const client = Client.getClient("undici",{
        requestTimeout: 100,
    } as any)
    await client.makeRequest({
        hostname: "google.com",
        protocol:"http",
        port:"80",
        method: "POST",
        body: "example",
        path: "/",
    } as any).then(console.log)
    await client.makeRequest({
        hostname: "google.com",
        protocol:"http",
        port:"8080",
        method: "GET",
        path: "/",
    } as any).then(console.log)
    await client.makeRequest({
        hostname: "google.com",
        protocol:"http",
        port:"8080",
        method: "GET",
        path: "/",
    } as any).then(console.log)
})()
