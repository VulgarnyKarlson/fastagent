import {Method} from "./method";
import {Protocol} from "./protocol";

export type responseType = "application/x-www-form-urlencoded"
    | "application/json"
    | "text"
    | "binary"
    | "application/octet-stream"
    | "application/pdf"
    | "image"
    | "empty"

export { Protocol };
export interface Options {
    uri?: string;
    host?: string;
    path?: string;
    responseType?: responseType;
    maxResponseSize?: number;
    method?: Method;
    timeout?: number;
    protocol?: Protocol;
    family?: 4 | 6;
    fakeTimeout?: number;
    postBody?: any;
    headers?: any;
    encoding?: string;
    agent?: any;
    httpAgent?: any;
    httpsAgent?: any;
}
