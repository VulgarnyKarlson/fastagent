import httpModule from "http_module/wrapper";

export function getClient(core: "http"|"undici", options: any) {
    if (core === "http") {
        return new httpModule(options);
    } else if (core === "undici") {
        return new UndiciModule(options);
    }
}
