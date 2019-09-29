export default (res, fn) => {
    let text = '';

    res.setEncoding('utf8');
    res.on('data', chunk => {
        text += chunk;
    });
    res.on('end', () => {
        fn(null, text)
    });
};
