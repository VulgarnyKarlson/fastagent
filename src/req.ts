import querystring from "querystring";
import client, {IncomingMessage} from "./enum/httpClient";
import {HttpStatus} from "./enum/httpStatus";
import {Options} from "./types/options";
import * as utils from "./utils";
import decompressResponse from "decompress-response";

export const request = (
    options: Options,
    endCB: (res: {
        data?: Buffer,
        statusMessage?: string;
        statusCode?: HttpStatus,
    }) => void,
) => {
    let timeoutHandler = null;
    if (options.encoding === "gzip") {
        options.headers["Content-Encoding"] = "gzip";
    }
    const req = client[options.protocol].request(options, (originalRes: IncomingMessage) => {
        const res = decompressResponse(originalRes);
        res.on("error", (err: Error & { code?: string }) => {
            clearTimeout(timeoutHandler);
            endCB(res);
        });
        if (options.responseType === "empty") {
            return res.resume().on("end", () => {
                clearTimeout(timeoutHandler);
                endCB(res);
            });
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
            clearTimeout(timeoutHandler);
            endCB(res);
        });
    });

    req.on("error", (err: Error & { code?: keyof HttpStatus }) => {
        clearTimeout(timeoutHandler);
        endCB({ statusCode: HttpStatus[err.code] || HttpStatus[err.message], statusMessage: err.code || err.message });
    });

    req.on("abort", () => {
        clearTimeout(timeoutHandler);
        endCB({ statusCode: HttpStatus.ABORTED });
    });

    if (typeof options.timeout === "number" && options.timeout > 0) {
        timeoutHandler = setTimeout(req.abort.bind(req), options.timeout);
    }

    if (options.method === "POST" || options.method === "post") {
        if (typeof options.encoding === "undefined") {
            req.write(options.postBody);
            req.end();
        } else if (options.encoding === "gzip") {
            if (typeof options.postBody === "object" && Buffer.isBuffer(options.postBody) === false) {
                options.postBody = JSON.stringify(options.postBody);
            }
            utils.compress(options.postBody).then( (compressed) => {
                req.write(compressed);
                req.end();
            });
        } else if (options.encoding === "formdata") {
            options.postBody = querystring.stringify(options.postBody);
            req.write(options.postBody);
            req.end();
        }
    } else {
        req.end();
    }
};
