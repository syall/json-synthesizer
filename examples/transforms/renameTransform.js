function renameTransform(path, name, rename) {

    function isObject(input) {
        return (
            input !== null &&
            typeof input === 'object'
        );
    }

    function transformHelper(input) {
        transformSearch(input);
        return input;
    }

    function transformSearch(input, search = path) {
        if (search.length === 0) {
            if (input[name] !== undefined) {
                const temp = input[name];
                delete input[name];
                input[rename] = temp;
            }
        } else {
            const [head, ...rest] = search;
            if (head === '*') {
                for (const v of Object.values(input)) {
                    if (isObject(v)) {
                        transformSearch(v, rest);
                    }
                }
            } else if (isObject(input[head])) {
                transformSearch(input[head], rest);
            }
        }
    };

    return transformHelper;
}

module.exports = renameTransform;
