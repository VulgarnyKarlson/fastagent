import mimicResponse from "mimic-response";
import {PassThrough, Transform} from "stream";
import zlib from "zlib";
import * as utils from "../utils";
import { HttpStatus } from "./interface";

export default (response) => {
    const contentEncoding = (response.headers["content-encoding"] || "").toLowerCase();
    let isEmpty = true;
    // zip bomb avoid
    let responseBytesLeft = response.maxResponseSize;
    const checker = new Transform({
        transform(chunk, encoding, callback) {
            isEmpty = false;
            responseBytesLeft -= chunk.byteLength || chunk.length;
            if (responseBytesLeft < 0) {
                const err = new Error("Maximum response size reached");
                Object.assign(err, {code: HttpStatus.MAX_BODYLENGTH});
                callback(err);
            } else {
                callback(null, chunk);
            }
        },

        flush(callback) {
            callback();
        },
    });

    const finalStream = new PassThrough({
        autoDestroy: false,
        destroy(error, callback) {
            callback(error);
        },
    });
    mimicResponse(response, finalStream);
    if (["gzip", "deflate", "br"].includes(contentEncoding)) {
        const decompressStream = contentEncoding === "br" ? zlib.createBrotliDecompress() : zlib.createUnzip();

        decompressStream.once("error", (error) => {
            if (isEmpty && !response.readable) {
                finalStream.end();
                return;
            }
            finalStream.destroy(error);
        });
        response.pipe(checker).pipe(decompressStream).pipe(finalStream);
    } else {
        response.pipe(checker).pipe(finalStream);
    }
    return new Promise( (resolve, reject) => {
        finalStream.on("error", (err: Error & { code?: string }) => {
            reject(err);
        });

        const data = [];
        finalStream.on("data", (chunk) => {
            responseBytesLeft -= chunk.byteLength || chunk.length;
            data.push(...chunk);
        });
        finalStream.on("end", () => {
            resolve(utils.fromArrayToBuffer(data));
        });
    });
};
