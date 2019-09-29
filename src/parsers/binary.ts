export default (res, fn) => {
    const data = []; // Binary data needs binary storage

    res.on('data', chunk => {
        data.push(...chunk);
    });
    res.on('end', () => {
        fn(null, Buffer.from(data));
    });
};
