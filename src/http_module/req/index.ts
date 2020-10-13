import http from "http";
import {responseType} from "http_module/res";
import https from "https";

export type Method =
    | "get" | "GET"
    | "post" | "POST";

export type Protocol = "https:" | "http:";

export const HttpClient = {
    "http:": http,
    "https:": https,
};

export type IncomingMessage = http.IncomingMessage;

export enum HttpStatus {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    AMBIGUOUS = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    REQUESTED_RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    I_AM_A_TEAPOT = 418,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
    ECONNRESET = 600,
    ETIMEDOUT = 601,
    EADDRINFO = 602,
    ESOCKETTIMEDOUT = 603,
    ABORTED = 604,
    ENOTFOUND = 605,
    ETOOLARGE = 606,
    ECONNREFUSED = 607,
    UNKNOWN = 1000,
}

export interface Options {
    uri?: string;
    host?: string;
    path?: string;
    port?: number;
    responseType?: responseType;
    maxResponseSize?: number;
    method?: Method;
    timeout?: number;
    protocol?: Protocol;
    family?: 4 | 6;
    postBody?: any;
    headers?: any;
    encoding?: "gzip" | "formdata";
    agent?: any;
    httpAgent?: any;
    httpsAgent?: any;
}

export { request } from "./req";
