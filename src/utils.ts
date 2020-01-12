import * as utils from "util";
import zlib, {InputType } from "zlib";

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
