import formidable from "formidable";
import { IncomingMessage} from "./enum/httpClient";
import {HttpStatus} from "./enum/httpStatus";
import parsers from "./parsers";
import {responseType} from "./types/options";
import {OutputMessage} from "./types/response";
import * as utils from "./utils";

export const parseResponse = (res: IncomingMessage & { data?: Buffer }, ResponseType: responseType): OutputMessage => {
    return {
        statusCode: res.statusCode,
        statusMessage: HttpStatus[res.statusCode] || res.statusMessage,
        raw: ResponseType === "empty" ? null : getParserType(res, ResponseType)(res.data),
    };
};

const getParserType = (res, parserType) => {
    let parser = parsers[parserType];
    if (!parser) {
        const mime = utils.type(res.headers["content-type"] || "") || "text/plain";
        const type = mime.split("/")[0];
        if (parsers[mime]) {
            parser = parsers[mime];
        } else if (type === "multipart") {
            const form = new formidable.IncomingForm();
            parser = form.parse.bind(form);
        } else if (utils.isText(mime)) {
            parser = parsers.text;
        } else if (utils.isJSON(mime)) {
            parser = parsers["application/json"];
        } else if (utils.isImageOrVideo(mime)) {
            parser = parsers.image;
        } else {
            parser = parsers.binary; // It's actually a generic Buffer
        }
    }

    return parser;
};
