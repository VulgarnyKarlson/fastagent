export interface RequestParams {
    host: string;
    port?: number;
    path: string;
    post?: any;
    headers?: object;
    timeout?: number;
    protocol: string;
    method: "post"|"get";
    encoding?: "gzip";
}
