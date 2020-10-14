export interface RequestParams {
    host: string;
    path: string;
    post?: any;
    headers?: object;
    timeout?: number;
    protocol: string;
    method: "POST"|"GET";
    encoding?: "gzip";
}
