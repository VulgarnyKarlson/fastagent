export default (data: Buffer)  => {
    try {
        return JSON.parse(data.toString("utf8"));
    } catch (err2) {
        return data;
    }
};
