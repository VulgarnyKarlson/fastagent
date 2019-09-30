import * as http from "./enum/httpClient";
import querystring from "querystring";
import {Options} from "./types/options";
import * as utils from "./utils";
import {IncomingMessage} from "./enum/httpClient";

export default class Request {
    private responseTimeout = null;

    constructor(
        private endCB: (res: IncomingMessage & {data?: Buffer}) => void,
        private errorCB: (error: Error) => void,
        private timeoutCB: () => void,
        private faketimeoutCB: () => void
    ) { }

    public request(
        options: Options
    ) {
        const timeout = options.timeout;
        delete options.timeout;
        const req = http.client[options.protocol].request(options, (res: http.IncomingMessage) => {
            res.on('error', err => {
                this.errorCB(err);
                this.destroy();
            });
            if (options.responseType === "empty") {
                res.resume().on("end", () => {
                    this.endCB(res);
                    this.destroy();
                })
            } else {
                // zlib support
                if (utils._shouldUnzip(res)) {
                    utils.unzip(req, res);
                }
                const data = [];
                // Protectiona against zip bombs and other nuisance
                let responseBytesLeft = options.maxResponseSize || 200000000;
                res.on('data', chunk => {
                    responseBytesLeft -= chunk.byteLength || chunk.length;
                    if (responseBytesLeft < 0) {
                        const err = new Error('Maximum response size reached');
                        Object.assign(err, {code: ''});
                        res.destroy(err);
                    } else {
                        data.push(...chunk);
                    }
                });
                res.on("end", () => {
                    Object.assign(res, { data: utils.fromArrayToBuffer(data) });
                    this.endCB(res);
                    this.destroy();
                })
            }
        }).on('error', err => {
            this.errorCB(err);
            this.destroy();
        }).on("abort", () => {
            this.timeoutCB()
        });
        if (options.method === 'POST' || options.method === "post") {
            this.IfRequestPost(req, options.postBody);
        }

        this.IfError(req);
        this.setTimeout(req, timeout);
        this.IfFakeTimeout(options.fakeTimeout);
        req.end();
    }

    private IfRequestPost(req, postBody) {
        if (typeof postBody !== 'string') {
            postBody = querystring.stringify(postBody)
        }
        req.write(postBody)
    }

    private setTimeout(req, timeout) {
        this.responseTimeout = setTimeout( () => {
            req.abort();
            this.destroy();
        }, timeout);
    }

    private IfFakeTimeout(fakeTimeout) {
        // req.abort() is high cost operation, sometimes servers are gives response, anyways we have default_timeout
        if (fakeTimeout) {
            setTimeout( () => {
                this.faketimeoutCB()
            }, fakeTimeout)
        }
    }

    private destroy() {
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
        }
    }
}
