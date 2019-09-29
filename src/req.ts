import * as http from "./enum/httpClient";
import querystring from "querystring";
import {EventEmitter} from "events";
import {Options} from "./types/options";
import {IncomingMessage} from "./enum/httpClient";
import * as utils from "./utils";



export default interface Req {
    once(event: "end", handler: (data?: Buffer) => void): this;
    once(event: "error", handler: (error: Error) => void): this;
    once(event: "timeout", handler: () => void): this;
    once(event: "faketimeout", handler: () => void): this;
    once(event: "drain", handler: (req, res: IncomingMessage) => void): this;
    constructor(): this;
}

export default class Request extends EventEmitter {
    private responseTimeout = null;

    constructor() {
        super();
    }

    public request(
        options: Options
    ) {
        const timeout = options.timeout;
        delete options.timeout;
        const req = http.client[options.protocol].request(options, (res: http.IncomingMessage) => {
            this.emit("drain", {
                req, res
            });

            // zlib support
            if (utils._shouldUnzip(res)) {
                utils.unzip(req, res);
            }

            if (options.responseType === "empty") {
                res.resume().on("end", () => {
                    this.emitAndDestroy(req, "end");
                })
            } else {
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
                    this.emitAndDestroy(req, "end", utils.fromArrayToBuffer(data));
                })
            }
        });
        if (options.method === 'POST' || options.method === "post") {
            this.IfRequestPost(req, options.postBody);
        }

        this.IfError(req);
        this.setTimeout(req, timeout);
        this.IfFakeTimeout(req, options.fakeTimeout);
        req.end();
    }

    private IfRequestPost(req, postBody) {
        if (typeof postBody !== 'string') {
            postBody = querystring.stringify(postBody)
        }
        req.write(postBody)
    }

    private IfError(req) {
        req.on('error', err => {
            this.emitAndDestroy(req, "error", err);
        });
    }

    private setTimeout(req, timeout) {
        this.responseTimeout = setTimeout( () => {
            req.abort();
            this.emitAndDestroy(req, "timeout");
            this.removeAllListeners();
        }, timeout);
    }

    private IfFakeTimeout(req, fakeTimeout) {
        // req.abort() is high cost operation, sometimes servers are gives response, anyways we have default_timeout
        if (fakeTimeout) {
            setTimeout( () => {
                this.emit(req, "faketimeout");
            }, fakeTimeout)
        }
    }

    private emitAndDestroy(req, event, data?) {
        this.emit(event, data);
        if (this.responseTimeout) {
            clearTimeout(this.responseTimeout);
        }
        req.removeAllListeners();
        this.removeAllListeners();
    }
}
