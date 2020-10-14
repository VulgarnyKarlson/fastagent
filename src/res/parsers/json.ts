export default (data: Buffer): Buffer | object  => {
    try {
        console.log(data.toString("utf8"));
        return JSON.parse(data.toString("utf8"));
    } catch (err2) {
        return data;
    }
};
