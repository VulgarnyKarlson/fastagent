import { IncomingMessage, Options, request } from "http_module/req";
import { OutputMessage, parseResponse } from "res";
import url from "url";

const DEFAULT_TIMEOUT = 60 * 1000;

export default class {
    private agents = {
        "http:": undefined,
        "https:": undefined,
    };

    constructor(public options: Options = {} as any) {
        this.agents["http:"] = options.httpAgent;
        this.agents["https:"] = options.httpsAgent;
    }

    public makeRequest(options: any, cb: (data: OutputMessage) => void) {
        let called = false;
        const callCallback = (data) => {
            if (called) {
                return;
            }
            called = true;
            cb(data);
        };

        request(
            { ... options, agent: this.agents[options.protocol] },
            (res: IncomingMessage & {data?: Buffer}) => callCallback(parseResponse(res, options.responseType)),
        );
    }

    public get(options: Options | string, cb: (data: OutputMessage) => void) {
        return this.makeRequest(this.getOptions(options), cb);
    }

    public post(opts: Options, cb: (data: OutputMessage) => void) {
        return this.makeRequest({ ... this.getOptions(opts), method: "POST" }, cb);
    }

    private getOptions(uri: any) {
        if (typeof uri.host === "string"
            && typeof uri.path === "string"
            && typeof uri.protocol === "string"
        ) {
            Object.assign(uri, this.options);
            return uri;
        }

        let options: any = {};
        if (typeof uri === "string") {
            options = { ... url.parse(uri), ... this.options };
        } else {
            if (typeof uri.uri === "undefined") {
                throw new Error("Pass correctly uri or host&path&protocol options");
            }
            options = { ... url.parse(uri.uri), ... uri, ... this.options };
        }

        options.protocol = options.protocol || "https:";
        options.timeout = options.timeout || DEFAULT_TIMEOUT;
        options.responseType = options.responseType || "binary";
        options.path = options.path || options.pathname + (options.search || "");
        options.headers = options.headers || {};
        return options;
    }
}
