import { Pool } from "undici";

export default class {
    private clients = [];

    constructor(private options = {
        connections: 100,
        pipelining: 10,
    }) {

    }

    makeRequest(opts: ) {

    }

    private getPool(host) {
        return this.clients[host] || [
            this.clients[host] = new Pool(host, this.options),
            this.clients[host],
        ][1];
    }
    // https://github.com/fastify/fast-proxy/blob/a2a0bc6f186945eaa633ea5f0e3cbbb5af21a254/lib/request.js
    // https://github.com/sindresorhus/decompress-response/blob/master/index.js
}
