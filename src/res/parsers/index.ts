import binary from "./binary";
import json from "./json";
import text from "./text";
import urlEncoded from "./urlencoded";

const parsers = {
    "application/x-www-form-urlencoded": urlEncoded,
    "application/json": json,
    "text": text,
    "binary": binary,
    "application/octet-stream": binary,
    "application/pdf": binary,
    "image": binary,
};

export default parsers;
