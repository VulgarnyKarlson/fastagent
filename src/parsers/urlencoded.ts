import qs from "qs";

export default (data: Buffer) => {
    try {
        return qs.parse(data.toString("ascii"))
    } catch (err) {
        return data;
    }
};
