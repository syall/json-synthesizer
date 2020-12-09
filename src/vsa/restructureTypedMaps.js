/**
 * @module {Function} restructureTypedMaps
 */
const convertTypedMapToTypedJson = require('./convertTypedMapToTypedJson');
const str = require('../util/str');
const isType = require('../util/isType');

/**
 * Restructure a Typed Map 1's keys based on Typed Map 2's keys
 *
 * @param {Map} typedMap1 - Typed Map to Restructure
 * @param {Map} typedMap2 - Typed Map Restructure Reference
 * @returns {Map} Restructured Typed Map
 * @throws Throws an error if an error occurred when restructuring Typed Maps
 */
function restructureTypedMaps(typedMap1, typedMap2) {
    try {
        const restructuredTypedMap = new Map();
        for (const [key2, value2] of typedMap2.entries()) {
            if (typedMap1.has(key2)) {
                const restructuredType = typedMap1.get(key2).type;
                if (!isType.isNull(restructuredType.array) &&
                    !isType.isNull(restructuredType.array.object) &&
                    !isType.isNull(value2.type.array) &&
                    !isType.isNull(value2.type.array.object)) {
                    restructuredType.array.object = restructureTypedMaps(
                        restructuredType.array.object,
                        value2.type.array.object
                    );
                }
                if (!isType.isNull(restructuredType.object) &&
                    !isType.isNull(value2.type.object)) {
                    restructuredType.object = restructureTypedMaps(
                        restructuredType.object,
                        value2.type.object
                    );
                }
                restructuredTypedMap.set(key2, {
                    prefix: value2.prefix,
                    type: restructuredType
                });
            } else {
                throw new Error(`Output Key "${key2}" doesn't exist`);
            }
        }
        return restructuredTypedMap;
    } catch (error) {
        throw new Error(
            `${error} when restructuring Typed Maps:\n` +
            `Typed Map 1:\n` +
            `${str(convertTypedMapToTypedJson(typedMap1))}\n` +
            `Typed Map 2:\n` +
            `${str(convertTypedMapToTypedJson(typedMap2))}`
        );
    }
}

module.exports = restructureTypedMaps;
