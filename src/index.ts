import { Options} from "types/options";
import Req from "./req";
import * as utils from "./utils";
import {HttpStatus} from "./enum/httpStatus";
import {parseResponse} from "./res";
import {OutputMessage} from "./types/response";
import url from "fast-url-parser";

const DEFAULT_TIMEOUT = 60 * 1000;

export { Options };
export { HttpStatus };
export { OutputMessage };

export default class Client {
    private requester = new Req();

    constructor(public options: Options = {} as any) {

    }

    public makeRequest(uri: Options | string, opts?: Options) {
        let options = {} as Options;
        if (typeof uri === "string") {
            options.uri = uri;
        };

        if (typeof opts !== "undefined") {
            Object.assign(options, opts);
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
        options.protocol = options.protocol || "https:";
        options.timeout = options.timeout || DEFAULT_TIMEOUT;
        options.responseType = options.responseType || "binary";
        this.requester.request(options);

        return new Promise( (resolve, reject) => {
            this.requester.once("drain", ({ req, res}) => {
                this.requester.once("end", (data: Buffer) => {
                    parseResponse(res, options.responseType, data).then( (data: OutputMessage) => {
                        utils.resolveOrReject(resolve, reject, data)
                    })
                })
            });

            this.requester.once("timeout", () => {
                utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.REQUEST_TIMEOUT))
            });

            this.requester.once("faketimeout", () => {
                utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.ABORTED));
            });
            this.requester.once("error", (error) => {
                if (error.message.indexOf(HttpStatus[HttpStatus.EADDRINFO]) !== -1) {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.EADDRINFO))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ECONNRESET]) !== -1) {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.ECONNRESET))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ETIMEDOUT]) !== -1) {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.ETIMEDOUT))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ESOCKETTIMEDOUT]) !== -1) {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.ESOCKETTIMEDOUT))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ENOTFOUND]) !== -1) {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.ENOTFOUND))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ETOOLARGE]) !== -1) {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.ETOOLARGE))
                } else if (error.message.indexOf(HttpStatus[HttpStatus.ECONNREFUSED]) !== -1) {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.ECONNREFUSED))
                } else {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.UNKNOWN))
                }
            })
        })

    }

    public get(uri: Options | string, opts?: Options) {
        return this.makeRequest(uri, { method: "GET", ... opts });
    }

    public post(uri: Options | string, opts?: Options) {
        return this.makeRequest(uri, { method: "POST", ... opts });
    }

    private getHttpWithMessage(code: number) {
        return {
            statusCode: code,
            statusMessage: HttpStatus[code]
        }
    }
}
