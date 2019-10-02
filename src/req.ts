import querystring from "querystring";
import * as http from "./enum/httpClient";
import {IncomingMessage} from "./enum/httpClient";
import {Options} from "./types/options";
import * as utils from "./utils";

export const request = (
    endCB: (res: IncomingMessage & {data?: Buffer}) => void,
    errorCB: (error: Error) => void,
    timeoutCB: () => void,
    faketimeoutCB: () => void,
    options: Options,
) => {
    let responseTimeout = null;
    const destroy = () => {
        if (responseTimeout) {
            clearTimeout(responseTimeout);
        }
    };

    const timeout = options.timeout;
    responseTimeout = setTimeout( () => {
        req.abort();
        destroy();
    }, timeout);

    // req.abort() is high cost operation, sometimes servers are gives response, anyways we have default_timeout
    if (options.fakeTimeout) {
        setTimeout( () => {
            faketimeoutCB();
        }, options.fakeTimeout);
    }

    delete options.timeout;
    const req = http.client[options.protocol].request(options, (res: http.IncomingMessage) => {
        res.on("error", (err) => {
            errorCB(err);
            destroy();
        });
        if (options.responseType === "empty") {
            res.resume().on("end", () => {
                endCB(res);
                destroy();
            });
        } else {
            // zlib support
            if (utils.shouldUnzip(res)) {
                utils.unzip(req, res);
            }
            const data = [];
            // Protectiona against zip bombs and other nuisance
            let responseBytesLeft = options.maxResponseSize || 200000000;
            res.on("data", (chunk) => {
                responseBytesLeft -= chunk.byteLength || chunk.length;
                if (responseBytesLeft < 0) {
                    const err = new Error("Maximum response size reached");
                    Object.assign(err, {code: ""});
                    res.destroy(err);
                } else {
                    data.push(...chunk);
                }
            });
            res.on("end", () => {
                Object.assign(res, { data: utils.fromArrayToBuffer(data) });
                endCB(res);
                destroy();
            });
        }
    }).on("error", (err) => {
        errorCB(err);
        destroy();
    }).on("abort", () => {
        timeoutCB();
    });

    if (options.method === "POST" || options.method === "post") {
        if (typeof options.postBody !== "string") {
            options.postBody = querystring.stringify(options.postBody);
        }
        req.write(options.postBody);
    }

    req.end();
};
