import urlEncoded from "./urlencoded";
import json from "./json";
import text from "./text";
import binary from "./binary";
import empty from "./empty";

const parsers = {
    "application/x-www-form-urlencoded": urlEncoded,
    "application/json": json,
    "text": text,
    "binary": binary,
    "application/octet-stream": binary,
    "application/pdf": binary,
    "image": binary,
    "empty": empty
};

export default parsers;
