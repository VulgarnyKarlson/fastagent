import { Pool } from "undici";
import {HttpStatus} from "../http_module/req";
import { parseResponse } from "../res";
import decompress from "./decompress";
import {RequestParams } from "./interface";
import {extractOpts} from "../utils";

export default class {
    private clients = [];

    constructor(private options: RequestParams) {
        this.options.connections = isNaN(Number(this.options.connectTimeout)) === false  ? Number(this.options.connectTimeout): 100
        this.options.pipelining = isNaN(Number(this.options.pipelining)) === false  ? Number(this.options.pipelining): 10
        this.options.requestTimeout = isNaN(Number(this.options.requestTimeout)) === false ? Number(this.options.requestTimeout): 1500
        this.options.bodyTimeout = this.options.requestTimeout
        this.options.headersTimeout = this.options.requestTimeout
        this.options.connectTimeout = this.options.requestTimeout
    }

    public async makeRequest(opts: RequestParams) {
        opts  = await extractOpts(opts)
        const pool = this.getPool(opts.host);
        const timeout = isNaN(Number(opts.requestTimeout)) === false ? opts.requestTimeout : this.options.requestTimeout
        try {
            const res = await pool.request({
                path: opts.path,
                method: opts.method,
                body: opts.body,
                bodyTimeout: timeout,
                connectTimeout: timeout,
                headersTimeout: timeout,
            });
            res.maxResponseSize = this.options.maxResponseSize;
            res.data = await decompress(res);
            return parseResponse(res, opts.responseType)
        } catch (e) {
            return {
                statusCode: HttpStatus[e.code] || HttpStatus.UNKNOWN,
                statusMessage: e.code,
            }
        }
    }

    private getPool(url) {
        return this.clients[url] || [
            this.clients[url] = new Pool(url, {
                headersTimeout: this.options.headersTimeout,
                connectTimeout: this.options.connectTimeout,
                bodyTimeout: this.options.bodyTimeout,
                connections: this.options.connections,
                pipelining: this.options.pipelining,
            } as any),
            this.clients[url],
        ][1];
    }
}
