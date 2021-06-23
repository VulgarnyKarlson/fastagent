import UndiciModule from "./undici_module/wrapper";

export function getClient(core: "http"|"undici", options?: any): UndiciModule {
    if (core === "undici") {
        return new UndiciModule(options);
    }
}
