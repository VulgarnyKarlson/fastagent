import {Method} from "./method";
import {Protocol} from "./protocol";

export interface Options {
    host: string;
    path: string;
    responseType?: "binary"|"text"|"json"|"urlencoded"
    method?: Method;
    timeout?: number;
    protocol: Protocol;
    family?: 4 | 6;
    fakeTimeout?: number;
    noResponse?: boolean;
    postBody?: any;
    headers?: any;
    encoding?: string;
    httpAgent?: any;
    httpsAgent?: any;
}
