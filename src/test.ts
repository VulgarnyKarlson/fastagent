import Client from "./";
const client = new Client();

( async() => {
    client.get({
        uri: "https://www.google.com",
        responseType: "text"
    }, console.log);
})();
