import Client from "./";
const client = new Client();

( async() => {
    console.log(await client.makeRequest({
        host: "www.google.com",
        path: "/",
        protocol: "https:",
        responseType: "empty",
        timeout: 2000,
    }).catch(console.log));
})();
