import { Options} from "types/options";
import Req from "./req";
import {HttpStatus} from "./enum/httpStatus";
import {parseResponse} from "./res";
import {OutputMessage} from "./types/response";
import url from "fast-url-parser";
import {IncomingMessage} from "./enum/httpClient";

const DEFAULT_TIMEOUT = 60 * 1000;

export { Options };
export { HttpStatus };
export { OutputMessage };

export default class Client {

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

        const requester = new Req(
            (res: IncomingMessage & {data?: Buffer}) => {
                callCallback(parseResponse(res, options.responseType));
            },
            (error: Error) => {
                if (typeof error.message !== "string") {
                    return callCallback(this.getHttpWithMessage(HttpStatus.UNKNOWN));
                }

                if (error.message.indexOf(HttpStatus[HttpStatus.EADDRINFO]) !== -1) {
                    callCallback(this.getHttpWithMessage(HttpStatus.EADDRINFO))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ECONNRESET]) !== -1
                    || error.message.indexOf("hang up") !== -1
                ) {
                    callCallback(this.getHttpWithMessage(HttpStatus.ECONNRESET))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ETIMEDOUT]) !== -1) {
                    callCallback(this.getHttpWithMessage(HttpStatus.ETIMEDOUT))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ESOCKETTIMEDOUT]) !== -1) {
                    callCallback(this.getHttpWithMessage(HttpStatus.ESOCKETTIMEDOUT))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ENOTFOUND]) !== -1) {
                    callCallback(this.getHttpWithMessage(HttpStatus.ENOTFOUND))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ETOOLARGE]) !== -1) {
                    callCallback(this.getHttpWithMessage(HttpStatus.ETOOLARGE))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ECONNREFUSED]) !== -1) {
                    callCallback(this.getHttpWithMessage(HttpStatus.ECONNREFUSED))
                } else {
                    callCallback(this.getHttpWithMessage(HttpStatus.UNKNOWN))
                }
            },
            () => {
                callCallback(this.getHttpWithMessage(HttpStatus.REQUEST_TIMEOUT));
            },
            () => {
                callCallback(this.getHttpWithMessage(HttpStatus.ABORTED));
            },
        );

        requester.request({ ... options, agent: this.agents[options.protocol] });
    }

    public get(options: Options | string, cb: (data: OutputMessage) => void) {
        options = this.getOptions(options);
        return this.makeRequest(options, cb);
    }

    public post(opts: Options, cb: (data: OutputMessage) => void) {
        const options = this.getOptions(opts);
        options.method = "POST";
        return this.makeRequest(options, cb);
    }

    private getOptions(uri: any) {
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
                throw new Error("Pass correctly url or host&path&protocol options")
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
