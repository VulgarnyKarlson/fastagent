export type responseType = "application/x-www-form-urlencoded"
    | "application/json"
    | "text"
    | "binary"
    | "application/octet-stream"
    | "application/pdf"
    | "image"
    | "empty";

export interface OutputMessage {
    statusCode: number;
    statusMessage: string;
    raw?: string;
}

export { parseResponse } from "./res";
