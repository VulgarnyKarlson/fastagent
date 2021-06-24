import * as utils from "util";
import zlib, {InputType} from "zlib";
import {HttpMethod, RequestParams} from "./undici_module/interface";
import urlParser from "fast-url-parser"

export const type = (str: string) => str.split(/ *; */).shift();

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

export const extractOpts = async (options: RequestParams) => {
    if (typeof options.url !== "undefined") {
        const parsed = urlParser.parse(options.url)
        options = { ...options, host: parsed.host, port: options.port, protocol: options.protocol, path: options.path }
    }
    if (options.encoding === "gzip") {
        options.headers["Content-Encoding"] = "gzip";
        if (options.body.length > 0) {
            options.body = await compress(options.body);
        }
    }
    options.protocol = options.protocol || "https:";
    options.method = options.method || HttpMethod.GET
    options.requestTimeout = options.requestTimeout || 1500;
    options.responseType = options.responseType || "binary";
    options.path = options.path || (options.pathname || "") + (options.search || "") || "/";
    options.port = typeof options.port !== "undefined" ? `:${options.port}`:""
    options.host = `${options.protocol}//${options.host || options.hostname}${options.port}`;
    return options
}
