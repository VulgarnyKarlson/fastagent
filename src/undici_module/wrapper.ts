import { Pool } from "undici";
import {HttpStatus} from "../http_module/req";
import { parseResponse } from "../res";
import * as utils from "../utils";
import decompress from "./decompress";
import {RequestParams } from "./interface";

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
        opts.responseType = opts.responseType || "binary";
        if (opts.encoding === "gzip") {
            opts.headers["Content-Encoding"] = "gzip";
            if (opts.body.length > 0) {
                opts.body = await utils.compress(opts.body);
            }
        }
        let host = opts.host
        if (opts.protocol === "https" && typeof opts.port === "undefined") {
            opts.port = ""
        }
        if (typeof opts.path === "undefined" || opts.path.length === 0) {
            opts.path = "/"
        }
        if (typeof host === "undefined") {
            host = opts.hostname + ":" + opts.port
        }
        const pool = this.getPool(host, opts.protocol);
        try {
            const res = await pool.request({
                path: opts.path,
                method: opts.method,
                body: opts.body,
                bodyTimeout: this.options.bodyTimeout,
                connectTimeout: this.options.connectTimeout,
                headersTimeout: this.options.headersTimeout,
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

    private getPool(host, protocol) {
        return this.clients[host] || [
            this.clients[host] = new Pool(`${protocol}://${host}`, {
                headersTimeout: this.options.headersTimeout,
                connectTimeout: this.options.connectTimeout,
                bodyTimeout: this.options.bodyTimeout,
                connections: this.options.connections,
                pipelining: this.options.pipelining,
            } as any),
            this.clients[host],
        ][1];
    }
}
