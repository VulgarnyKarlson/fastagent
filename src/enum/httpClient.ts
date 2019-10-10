import http from "http";
import https from "https";

export default  {
    "http:": http,
    "https:": https,
};

export type IncomingMessage = http.IncomingMessage;
