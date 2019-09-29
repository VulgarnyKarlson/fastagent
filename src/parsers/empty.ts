export default (res, fn) => {
    res.resume().on('end', () => {
        fn(null, null)
    });
};
