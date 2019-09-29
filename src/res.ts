import parsers from "./parsers";
import * as utils from "./utils";
import {OutputMessage} from "./types/response";
import formidable from "formidable"
import {HttpStatus} from "./enum/httpStatus";
import { IncomingMessage} from "./enum/httpClient";
import {responseType} from "./types/options";

export const parseResponse = (res: IncomingMessage & { data?: Buffer }, responseType: responseType): OutputMessage => {
    return {
        statusCode: res.statusCode,
        statusMessage: HttpStatus[res.statusCode] || res.statusMessage,
        raw: responseType === "empty" ? null: getParserType(res, responseType)(res.data),
    }
};


const getParserType = (res, parserType) => {
    let parser = parsers[parserType];
    if (!parser) {
        const mime = utils.type(res.headers['content-type'] || '') || 'text/plain';
        const type = mime.split('/')[0];
        if (parsers[mime]) {
            parser = parsers[mime];
        } else if (type === 'text') {
            parser = parsers.text;
        } else if (type === "multipart") {
            const form = new formidable.IncomingForm();
            parser = form.parse.bind(form);
        } else if (utils.isImageOrVideo(mime)) {
            parser = parsers.image;
        } else if (utils.isJSON(mime)) {
            parser = parsers['application/json'];
        } else {
            parser = parsers.binary; // It's actually a generic Buffer
        }
    }

    return parser;
};
