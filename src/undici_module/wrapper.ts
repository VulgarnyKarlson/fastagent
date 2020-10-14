import { Pool } from "undici";
import {RequestParams } from "undici_module/interface";
import {HttpStatus} from "../http_module/req";
import { parseResponse } from "../res";
import * as utils from "../utils";
import decompress from "./decompress";

export default class {
    private clients = [];

    constructor(private options = {
        connections: 100,
        pipelining: 10,
        maxResponseSize: 200000000,
    }) {

    }

    // tslint:disable-next-line:cognitive-complexity
    public makeRequest(opts: RequestParams) {
        opts.responseType = opts.responseType || "binary";
        return new Promise( async (resolve) => {
            if (opts.encoding === "gzip") {
                opts.headers["Content-Encoding"] = "gzip";
                if (opts.body.length > 0) {
                    opts.body = await utils.compress(opts.body);
                }
            }
            const pool = this.getPool(opts.host, opts.protocol);
            pool.request(opts, async (err, res) => {
                if (err) {
                    return resolve({
                        statusCode: res.statusCode,
                        statusMessage: HttpStatus[res.statusCode] || res.statusMessage,
                    });
                } else {
                    try {
                        res.body.headers = res.headers;
                        res.body.maxResponseSize = this.options.maxResponseSize;
                        res.data = await decompress(res.body);
                        resolve(parseResponse(res, opts.responseType));
                    } catch (e) {
                        resolve({
                            statusMessage: e.code || res.statusCode,
                            statusCode: e.statusMessage || HttpStatus.UNKNOWN,
                        });
                    }
                }
            });
        });
    }

    private getPool(host, protocol) {
        return this.clients[host] || [
            this.clients[host] = new Pool(`${protocol}://${host}`, this.options),
            this.clients[host],
        ][1];
    }
}
