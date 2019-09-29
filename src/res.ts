import parsers from "./parsers";
import * as utils from "./utils";
import {OutputMessage} from "./types/response";
import formidable from "formidable"
import {HttpStatus} from "./enum/httpStatus";
import { IncomingMessage} from "./enum/httpClient";

export const parseResponse = async (req, res: IncomingMessage, parserType): Promise<OutputMessage> => {
    const parser = getParserType(res, parserType);

    // zlib support
    if (utils._shouldUnzip(res)) {
        utils.unzip(req, res);
    }

    return new Promise((resolve, reject) => {
        parser(res, (err, obj) => {
            utils.resolveOrReject(resolve, reject,{
                statusCode: res.statusCode,
                statusMessage: HttpStatus[res.statusCode] || res.statusMessage,
                raw: obj,
            });
        });
    });
};


const getParserType = (res, parserType) => {
    let parser = parsers[parserType];
    let buffer = false;
    const mime = utils.type(res.headers['content-type'] || '') || 'text/plain';
    const type = mime.split('/')[0];
    if (!parser) {
        if (parsers[mime]) {
            parser = parsers[mime];
        } else if (type === 'text') {
            parser = parsers.text;
            buffer = buffer !== false;
        } else if (type === "multipart") {
            const form = new formidable.IncomingForm();
            parser = form.parse.bind(form);
            buffer = true;
        } else if (utils.isImageOrVideo(mime)) {
            parser = parsers.image;
            buffer = true; // For backwards-compatibility buffering default is ad-hoc MIME-dependent
        } else if (utils.isJSON(mime)) {
            parser = parsers['application/json'];
            buffer = buffer !== false;
        } else {
            parser = parsers.binary; // It's actually a generic Buffer
            buffer = true;
        }
    } else if (utils.isText(mime) || utils.isJSON(mime)){
        buffer = true;
    }


    checkForBufferGrenade(res, buffer);
    return parser;
};


const checkForBufferGrenade = (res, buffer) => {
    if (buffer === false) {
        return;
    }

    // Protectiona against zip bombs and other nuisance
    let responseBytesLeft = this._maxResponseSize || 200000000;
    res.on('data', buf => {
        responseBytesLeft -= buf.byteLength || buf.length;
        if (responseBytesLeft < 0) {
            const err = new Error('Maximum response size reached');
            Object.assign(err, {code: 'ETOOLARGE'});
            res.destroy(err);
        }
    });
};
