/**
 * @module {Object} intersects
 * @description Intersects for Typed Maps and Types
 */
const convertTypedMapToTypedJson = require('./convertTypedMapToTypedJson');
const isType = require('../util/isType');
const str = require('../util/str');

/**
 * Intersect two Typed Maps based on Keys and Types
 *
 * @param {Map} typedMap1 - Map to Intersect
 * @param {Map} typedMap2 - Map to Intersect
 * @returns {Map} Intersected Map
 * @throws Throws an error if error occurred when intersecting Typed Maps
 */
function intersectTypedMaps(typedMap1, typedMap2) {
    try {
        const keys = new Set([...typedMap1.keys(), ...typedMap2.keys()]);
        const intersectedTypeMap = new Map();
        for (const key of keys) {
            const inT1 = typedMap1.get(key);
            const inT2 = typedMap2.get(key);
            if (inT1 !== undefined && inT2 !== undefined) {
                const t1Prefix = inT1.prefix.join('.');
                const t2Prefix = inT2.prefix.join('.');
                if (t1Prefix !== t2Prefix) {
                    throw new Error(`Prefixes "${t1Prefix}" and "${t2Prefix}" for Key "${key}" do not match`);
                }
                const type = intersectTypes(inT1.type, inT2.type);
                if (!isType.isNull(type)) {
                    intersectedTypeMap.set(key, {
                        prefix: inT1.prefix,
                        type
                    });
                }
            }
        }
        return intersectedTypeMap;
    } catch (error) {
        throw new Error(
            `${error} when intersecting Typed Maps:\n` +
            `Typed Map 1:\n` +
            `${str(convertTypedMapToTypedJson(typedMap1))}\n` +
            `Typed Map 2:\n` +
            `${str(convertTypedMapToTypedJson(typedMap2))}`
        );
    }
}

/**
 * Intersect two Types based on Types
 *
 * @param {Object} type1 - Type to Intersect (array, object, types)
 * @param {Object} type2 - Type to Intersect (array, object, types)
 * @returns {(Object|null)} Intersected Type if not null
 */
function intersectTypes(type1, type2) {

    const intersectedType = {
        array: null,
        object: null,
        types: null
    };

    // array
    if (!isType.isNull(type1.array) && !isType.isNull(type2.array)) {
        intersectedType.array = intersectTypes(type1.array, type2.array);
    }

    // object
    if (!isType.isNull(type1.object) && !isType.isNull(type2.object)) {
        intersectedType.object = intersectTypedMaps(type1.object, type2.object);
        if (intersectedType.object.size === 0) {
            intersectedType.object = null;
        }
    }

    // types
    if (!isType.isNull(type1.types) && !isType.isNull(type2.types)) {
        intersectedType.types = new Set();
        for (const type of Array.from(new Set([...type1.types, ...type2.types]))) {
            if (type1.types.has(type) && type2.types.has(type)) {
                intersectedType.types.add(type);
            }
        }
        if (intersectedType.types.size === 0) {
            intersectedType.types = null;
        }
    }

    // mutually exclusive
    if (isType.isNull(intersectedType.array) &&
        isType.isNull(intersectedType.object) &&
        isType.isNull(intersectedType.types)) {
        return null;
    }

    return intersectedType;
}

module.exports = {
    intersectTypedMaps,
    intersectTypes
};
