import { StringDecoder } from "string_decoder";
import Stream from "stream";
import zlib from "zlib";
import {OutputMessage} from "./types/response";

export const type = (str: string) => str.split(/ *; */).shift();

export const _shouldUnzip = res => {
    if (res.statusCode === 204 || res.statusCode === 304) {
        // These aren't supposed to have any body
        return false;
    }

    // header content is a string, and distinction between 0 and no information is crucial
    if (res.headers['content-length'] === '0') {
        // We know that the body is empty (unfortunately, this check does not cover chunked encoding)
        return false;
    }

    // console.log(res);
    return /^\s*(?:deflate|gzip)\s*$/.test(res.headers['content-encoding']);
};

export const unzip = (req, res) => {
    const unzip = zlib.createUnzip();
    const stream = new Stream();
    let decoder;

    // make node responseOnEnd() happy
    // @ts-ignore
    stream.req = req;

    unzip.on('error', (err: any) => {
        if (err && err.code === 'Z_BUF_ERROR') {
            // unexpected end of file is ignored by browsers and curl
            stream.emit('end');
            return;
        }

        stream.emit('error', err);
    });

    // pipe to unzip
    res.pipe(unzip);

    // override `setEncoding` to capture encoding
    res.setEncoding = type => {
        decoder = new StringDecoder(type);
    };

    // decode upon decompressing with captured encoding
    unzip.on('data', buf => {
        if (decoder) {
            const str = decoder.write(buf);
            if (str.length > 0) stream.emit('data', str);
        } else {
            stream.emit('data', buf);
        }
    });

    unzip.on('end', () => {
        stream.emit('end');
    });

    // override `on` to capture data listeners
    const _on = res.on;
    res.on = function(type, fn) {
        if (type === 'data' || type === 'end') {
            stream.on(type, fn.bind(res));
        } else if (type === 'error') {
            stream.on(type, fn.bind(res));
            _on.call(res, type, fn);
        } else {
            _on.call(res, type, fn);
        }

        return this;
    };
};

export const resolveOrReject = (resolve, reject, data: OutputMessage) => {
    if (data === null || data) {
        resolve(data);
    } else {
        reject(data);
    }
};

export const isText = (mime: string) => {
    const parts = mime.split('/');
    const type = parts[0];
    const subtype = parts[1];

    return type === 'text' || subtype === 'x-www-form-urlencoded';
};

export const isImageOrVideo = (mime: string) => {
    const type = mime.split('/')[0];

    return type === 'image' || type === 'video';
};

export const isJSON = (mime: string) => {
    // should match /json or +json
    // but not /json-seq
    return /[/+]json($|[^-\w])/.test(mime);
};

/**
 * Check if we should follow the redirect `code`.
 *
 * @param {Number} code
 * @return {Boolean}
 * @api private
 */

function isRedirect(code) {
    return [301, 302, 303, 305, 307, 308].indexOf(code) !== -1;
}

