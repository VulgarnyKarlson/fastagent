export const HOST = "benchmark.io";
export const HTTP_BASE_URL = `http://${HOST}`;
export const HTTPS_BASE_URL = `https://${HOST}`;
export const PATH = "/run";
export const RESPONSE_BODY = JSON.stringify({ message: "Hello world" });

export const Host200 = {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello world" }),
};
