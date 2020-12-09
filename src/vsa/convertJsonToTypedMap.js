/**
 * @module {Function} convertJsonToTypedMap
 */
const { unionTypedMaps, unionTypes } = require('./unions');
const isType = require('../util/isType');
const str = require('../util/str');

/**
 * Convert JSON to a Typed Map
 *
 * @description Converts a JSON object to a Typed Map based on Keys and Paths.
 * See {@link https://json-synthesizer.syall.work/DESIGN.html#typed-map|here}
 * for more details about Typed Maps.
 * @param {Object} json - JSON object to convert
 * @returns {Map} Typed Map of JSON object
 * @throws Throws an error if error occurred when converting JSON to Typed Map
 */
function convertJsonToTypedMap(json) {
    try {
        const typedMap = new Map();
        traverseObject([], json, typedMap);
        return typedMap;
    } catch (error) {
        throw new Error(
            `${error} when converting JSON to Typed Map:\n` +
            `JSON: ${str(json)}`
        );
    }
}

/**
 * Routes JSON to Typed Map Conversion based on input type
 *
 * @param {string[]} path - Keys already traversed to get to the input
 * @param {(Array|Object|string|number|boolean|null)} input - Input Value
 * @param {Map} typedMap - Typed Map being added to
 */
function traverseJson(path, input, typedMap) {
    if (isType.isArray(input)) {
        traverseArray(path, input, typedMap);
    } else if (isType.isObject(input)) {
        traverseObject(path, input, typedMap);
    } else {
        traverseSingleValue(path, input, typedMap);
    }
}

/**
 * Convert Array to Typed Map Entry
 *
 * @param {string[]} path - Keys already traversed to get to the input
 * @param {Array} input - Input Array to Convert
 * @param {Map} typedMap - Typed Map being added to
 * @throws Throws an error when a Key already exists in typedMap
 */
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

/**
 * Get Type of an Array
 *
 * @param {Array} input - Input Array to get type of
 * @return {Object} Type of Array (array, object, types)
 */
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

/**
 * Traverse Object Values to Typed Map Entry
 *
 * @param {string[]} path - Keys already traversed to get to the input
 * @param {Object} input - Input Object to traverse
 * @param {Map} typedMap - Typed Map being added to
 */
function traverseObject(path, input, typedMap) {
    for (const [key, value] of Object.entries(input)) {
        traverseJson([...path, key], value, typedMap);
    }
}

/**
 * Convert Single Values to Typed Map Entry
 *
 * @param {string[]} path - Keys already traversed to get to the input
 * @param {(string|number|boolean|null)} input - Input Value to Convert
 * @param {Map} typedMap - Typed Map being added to
 * @throws Throws an error when a Key already exists in typedMap
 */
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
