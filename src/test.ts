import Client from "./";
const client = new Client();

( async() => {
    console.log(await client.makeRequest("https://www.google.com", {
        responseType: "text"
    }).catch(console.log));
})();
