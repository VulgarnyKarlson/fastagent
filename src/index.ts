import { Options} from "./types/options";
import { request } from "./req";
import {HttpStatus} from "./enum/httpStatus";
import {parseResponse} from "./res";
import {OutputMessage} from "./types/response";
import url from "fast-url-parser";
import {IncomingMessage} from "./enum/httpClient";

const DEFAULT_TIMEOUT = 60 * 1000;

export { Options };
export { HttpStatus };
export { OutputMessage };

export default class {

    private agents = {
        "http:": undefined,
        "https:": undefined,
    };

    constructor(public options: Options = {} as any) {
        this.agents["http:"] = options.httpAgent;
        this.agents["https:"] = options.httpsAgent;
    }

    public makeRequest(options: any, cb: (data: OutputMessage) => void) {
        let called = false;
        const callCallback = (data) => {
            if (called) {
                return;
            }
            called = true;
            cb(data);
        };

        request(
            (res: IncomingMessage & {data?: Buffer}) => callCallback(parseResponse(res, options.responseType)),
            (error: Error) => callCallback(this.errorCB(error)),
            () => callCallback(this.getHttpWithMessage(HttpStatus.REQUEST_TIMEOUT)),
            () => callCallback(this.getHttpWithMessage(HttpStatus.ABORTED)),
            { ... options, agent: this.agents[options.protocol] }
        );
    }

    public get(options: Options | string, cb: (data: OutputMessage) => void) {
        return this.makeRequest(this.getOptions(options), cb);
    }

    public post(opts: Options, cb: (data: OutputMessage) => void) {
        return this.makeRequest({ ... this.getOptions(opts), method: "POST" }, cb);
    }

    private errorCB(error) {
        if (typeof error.message !== "string") {
            return this.getHttpWithMessage(HttpStatus.UNKNOWN);
        }

        if (error.message.indexOf(HttpStatus[HttpStatus.EADDRINFO]) !== -1) {
            this.getHttpWithMessage(HttpStatus.EADDRINFO)
        } else if (error.message.indexOf(HttpStatus[HttpStatus.ECONNRESET]) !== -1
            || error.message.indexOf("hang up") !== -1
        ) {
            this.getHttpWithMessage(HttpStatus.ECONNRESET);
        } else if (error.message.indexOf(HttpStatus[HttpStatus.ETIMEDOUT]) !== -1) {
            this.getHttpWithMessage(HttpStatus.ETIMEDOUT);
        } else if (error.message.indexOf(HttpStatus[HttpStatus.ESOCKETTIMEDOUT]) !== -1) {
            this.getHttpWithMessage(HttpStatus.ESOCKETTIMEDOUT);
        } else if (error.message.indexOf(HttpStatus[HttpStatus.ENOTFOUND]) !== -1) {
            this.getHttpWithMessage(HttpStatus.ENOTFOUND);
        } else if (error.message.indexOf(HttpStatus[HttpStatus.ETOOLARGE]) !== -1) {
            this.getHttpWithMessage(HttpStatus.ETOOLARGE);
        } else if (error.message.indexOf(HttpStatus[HttpStatus.ECONNREFUSED]) !== -1) {
            this.getHttpWithMessage(HttpStatus.ECONNREFUSED);
        } else {
            this.getHttpWithMessage(HttpStatus.UNKNOWN);
        }
    }

    private getOptions(uri: any) {
        if (typeof uri !== "string"
            && typeof uri.host === "string"
            && typeof uri.path === "string"
            && typeof uri.protocol === "string"
        ) {
            uri.protocol = (uri._protocol || "https") + ":";
            Object.assign(uri, this.options);
            return uri;
        }

        let options = {} as any;
        if (typeof uri === "string") {
            options.uri = uri;
        } else {
            Object.assign(options, uri);
        }

        Object.assign(options, this.options);
        if (typeof options.uri === "string" && options.uri.indexOf("http") === -1) {
            if (typeof options.protocol === "undefined") {
                options.uri = "http://" + options.uri;
            } else {
                options.uri = options.protocol + "//" + options.uri;
            }
        }
        if (typeof options.host === "undefined"
            || typeof options.path === "undefined"
            || typeof options.protocol === "undefined"
        ) {
            if (typeof options.uri === "undefined") {
                throw new Error("Pass correctly uri or host&path&protocol options")
            }
            Object.assign(options, url.parse(options.uri))
        }
        options.protocol = (options._protocol || "https") + ":";
        options.timeout = options.timeout || DEFAULT_TIMEOUT;
        options.responseType = options.responseType || "binary";
        options.path = (options.pathname || options.path) + (options.search || "");
        if (options._port !== -1) {
            options.port = options._port;
        }
        return options;
    }

    private getHttpWithMessage(code: number) {
        return {
            statusCode: code,
            statusMessage: HttpStatus[code]
        }
    }
}
