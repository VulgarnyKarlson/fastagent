import qs from "qs";

export default (res, fn) => {
    let text = '';
    res.setEncoding('ascii');
    res.on('data', chunk => {
        text += chunk;
    });
    res.on('end', () => {
        try {
            fn(null, qs.parse(res.text));
        } catch (err) {
            fn(err, text);
        }
    });
};
