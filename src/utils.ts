import Stream from "stream";
import { StringDecoder } from "string_decoder";
import * as utils from "util";
import zlib, {CompressCallback, InputType } from "zlib";

export const type = (str: string) => str.split(/ *; */).shift();

export const shouldUnzip = (res) => {
    if (res.statusCode === 204 || res.statusCode === 304) {
        // These aren't supposed to have any body
        return false;
    }

    // header content is a string, and distinction between 0 and no information is crucial
    if (res.headers["content-length"] === "0") {
        // We know that the body is empty (unfortunately, this check does not cover chunked encoding)
        return false;
    }

    return /^\s*(?:deflate|gzip)\s*$/.test(res.headers["content-encoding"]);
};

export const unzip = (req, res) => {
    const unziped = zlib.createUnzip();
    const stream = new Stream();
    let decoder;

    // make node responseOnEnd() happy
    // @ts-ignore
    stream.req = req;

    unziped.on("error", (err: any) => {
        if (err && err.code === "Z_BUF_ERROR") {
            // unexpected end of file is ignored by browsers and curl
            stream.emit("end");
            return;
        }

        stream.emit("error", err);
    });

    // pipe to unzip
    res.pipe(unziped);

    // override `setEncoding` to capture encoding
    res.setEncoding = (t) => {
        decoder = new StringDecoder(t);
    };

    // decode upon decompressing with captured encoding
    unziped.on("data", (buf) => {
        if (decoder) {
            const str = decoder.write(buf);
            if (str.length > 0) { stream.emit("data", str); }
        } else {
            stream.emit("data", buf);
        }
    });

    unziped.on("end", () => {
        stream.emit("end");
    });

    // override `on` to capture data listeners
    const _ON = res.on;
    res.on = function(t, fn) {
        if (t === "data" || t === "end") {
            stream.on(t, fn.bind(res));
        } else if (t === "error") {
            stream.on(t, fn.bind(res));
            _ON.call(res, t, fn);
        } else {
            _ON.call(res, t, fn);
        }

        return this;
    };
};

export const compress: (buf: InputType) => Promise<Buffer> = utils.promisify(zlib.gzip);

export const isText = (mime: string) => {
    const parts = mime.split("/");
    const t = parts[0];
    const subtype = parts[1];

    return t === "text" || subtype === "x-www-form-urlencoded";
};

export const isImageOrVideo = (mime: string) => {
    const t = mime.split("/")[0];

    return t === "image" || t === "video";
};

export const isJSON = (mime: string) => {
    // should match /json or +json
    // but not /json-seq
    return /[/+]json($|[^-\w])/.test(mime);
};

export const fromArrayToBuffer = (arr) => {
    const buff = Buffer.from(arr);
    arr.length = 0;
    return buff;
};
