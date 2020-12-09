/**
 * @module {Function} convertTypedMapToTypedJson
 */
const isType = require('../util/isType');

/**
 * Convert Typed Map to Typed JSON
 *
 * @description Convert Typed Map to Typed JSON. See {@link https://json-synthesizer.syall.work/DESIGN.html#typed-json|here}
 * for more details about Typed JSON.
 * @param {Map} typedMap - Typed Map to Convert
 * @returns {Object} Typed JSON object
 * @throws Throws an error if error occurred when converting Typed Map to Typed JSON
 */
function convertTypedMapToTypedJson(typedMap) {
    try {
        const typedJson = {};
        for (const [key, value] of typedMap.entries()) {
            let assignee = typedJson;
            for (const prepart of value.prefix) {
                if (assignee[prepart] === undefined) {
                    assignee[prepart] = {
                        array: null,
                        object: {},
                        types: null
                    };
                }
                assignee = assignee[prepart].object;
            }
            assignee[key] = convertTypeToTypedJson(value.type);
        }
        return typedJson;
    } catch (error) {
        throw new Error(`${error} when converting Typed Map to Typed JSON`);
    }
}

/**
 * Convert Type to Typed JSON
 *
 * @param {Object} typed - Type to Convert (array, object, types)
 * @returns {Object} Typed JSON object
 */
function convertTypeToTypedJson(type) {
    const convertedType = {
        array: null,
        object: null,
        types: null
    };
    if (!isType.isNull(type.array)) {
        convertedType.array = convertTypeToTypedJson(type.array);
    }
    if (!isType.isNull(type.object)) {
        convertedType.object = convertTypedMapToTypedJson(type.object);
    }
    if (!isType.isNull(type.types)) {
        convertedType.types = Array.from(type.types);
    }
    return convertedType;
}

module.exports = convertTypedMapToTypedJson;;
