const { unionTypedMaps, unionTypes } = require('./unions');
const isType = require('./util/isType');
const str = require('./util/str');

// convert JSON to Typed Map
function convertJsonToTypedMap(json) {
    try {
        const typedMap = new Map();
        traverseObject([], json, typedMap);
        return typedMap;
    } catch (error) {
        console.error(
            `${error} when converting JSON to Typed Map:\n` +
            `JSON: ${str(json)}`
        );
        process.exit(1);
    }
}

// traverse JSON router
function traverseJson(path, input, typedMap) {
    if (isType.isArray(input)) {
        traverseArray(path, input, typedMap);
    } else if (isType.isObject(input)) {
        traverseObject(path, input, typedMap);
    } else {
        traverseSingleValue(path, input, typedMap);
    }
}

// traverse Array: Complex Value Base Case
function traverseArray(path, input, typedMap) {
    const key = path[path.length - 1];
    if (typedMap.has(key)) {
        throw new Error(`Duplicate Key "${key}"`);
    }
    const prefix = path.slice(0, path.length - 1);
    const type = {
        array: getArrayType(input),
        object: null,
        types: null
    };
    typedMap.set(key, { prefix, type });
}

// get Array Type
function getArrayType(input) {
    const types = {
        array: null,
        object: null,
        types: null
    };
    for (const item of input) {
        if (isType.isArray(item)) {
            const type = getArrayType(item);
            if (types.array === null) {
                types.array = type;
            } else {
                types.array = unionTypes(types.array, type);
            }
        }
        else if (isType.isObject(item)) {
            const typedMap = new Map();
            traverseJson([], item, typedMap);
            if (types.object === null) {
                types.object = typedMap;
            } else {
                types.object = unionTypedMaps(types.object, typedMap);
            }
        } else {
            const type = isType.singleValue(item);
            if (types.types === null) {
                types.types = new Set([type]);
            } else {
                types.types.add(type);
            }
        }
    }
    return types;
}

// traverse Object: manage path
function traverseObject(path, input, typedMap) {
    for (const [key, value] of Object.entries(input)) {
        traverseJson([...path, key], value, typedMap);
    }
}

// traverse Single Value: Simple Value Base Case
function traverseSingleValue(path, input, typedMap) {
    const key = path[path.length - 1];
    if (typedMap.has(key)) {
        throw new Error(`Duplicate Key "${key}"`);
    }
    const prefix = path.slice(0, path.length - 1);
    const type = {
        array: null,
        object: null,
        types: new Set([isType.singleValue(input)])
    };
    typedMap.set(key, { prefix, type });
}

module.exports = convertJsonToTypedMap;
