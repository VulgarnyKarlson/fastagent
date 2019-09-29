import http from "http";
import https from "https";

export const client = {
    "http:": http,
    "https:": https,
};

export type IncomingMessage = http.IncomingMessage;
