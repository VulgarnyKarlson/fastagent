import { Options} from "types/options";
import Req from "./req";
import * as utils from "./utils";
import {HttpStatus} from "./enum/httpStatus";
import {parseResponse} from "./res";
import {OutputMessage} from "./types/response";

const DEFAULT_TIMEOUT = 60 * 1000;

export default class Client {
    private requester = new Req();

    constructor(public options: Options = {} as any) {

    }

    public makeRequest(options: Options) {
        Object.assign(options, this.options);
        options.timeout = options.timeout || DEFAULT_TIMEOUT;

        this.requester.request(options);

        return new Promise( (resolve, reject) => {
            this.requester.once("drain", ({ req, res}) => {
                parseResponse(req, res, options.responseType).then( (data: OutputMessage) => {
                    utils.resolveOrReject(resolve, reject, data)
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
                } else {
                    utils.resolveOrReject(resolve, reject, this.getHttpWithMessage(HttpStatus.UNKNOWN))
                }
            })
        })

    }

    private getHttpWithMessage(code: number) {
        return {
            statusCode: code,
            statusMessage: HttpStatus[code]
        }
    }
}
