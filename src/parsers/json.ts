export default (res, fn)  => {
    let text = '';
    res.setEncoding('utf8');
    res.on('data', chunk => {
        text += chunk;
    });
    res.on('end', () => {
        let body;
        let err;
        try {
            body = res.text && JSON.parse(res.text);
            fn(null, body);
        } catch (err2) {
            fn(err2, body);
        }
    });
};
