const isType = {
    isArray: input =>
        Array.isArray(input),
    isNull: input =>
        input === null,
    isObject: input =>
        input !== null && (typeof input) === 'object',
    singleValue: input =>
        input === null ? 'null' : (typeof input)
};

module.exports = isType;
