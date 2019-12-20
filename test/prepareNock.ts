import nock from "nock";
import {HTTP_BASE_URL, PATH} from "../benchmark/_constants";
export {
    HTTP_BASE_URL,
    PATH,
    RESPONSE_BODY,
} from "../benchmark/_constants";

export const setupNock = (data, options: {
    headers?: { [x:string]: string },
    timeout?: number,
}) => {
    nock(HTTP_BASE_URL)
        .defaultReplyHeaders(options.headers)
        .get(PATH)
        .delayConnection(options.timeout || 1)
        .reply(200, data)
};
