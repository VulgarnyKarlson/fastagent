export default (data: Buffer): Buffer | object  => {
    try {
        return JSON.parse(data.toString("utf8"));
    } catch (err2) {
        return data;
    }
};
