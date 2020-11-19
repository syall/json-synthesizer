const convertTypeToTypedJson = require('./convertTypedMapToTypedJson');
const isType = require('./util/isType');
const str = require('./util/str');

// union Typed Maps
function unionTypedMaps(typedMap1, typedMap2) {
    try {
        const keys = new Set([...typedMap1.keys(), ...typedMap2.keys()]);
        const unionedTypeMap = new Map();
        for (const key of keys) {
            const inT1 = typedMap1.get(key);
            const inT2 = typedMap2.get(key);
            if (inT1 !== undefined && inT2 !== undefined) {
                const t1Prefix = inT1.prefix.join('.');
                const t2Prefix = inT2.prefix.join('.');
                if (t1Prefix !== t2Prefix) {
                    throw new Error(`Prefixes "${t1Prefix}" and "${t2Prefix}" for Key "${key}" do not match`);
                }
                unionedTypeMap.set(key, {
                    prefix: inT1.prefix,
                    type: unionTypes(inT1.type, inT2.type)
                });
            } else if (inT1 !== undefined) {
                unionedTypeMap.set(key, inT1);
            } else if (inT2 !== undefined) {
                unionedTypeMap.set(key, inT2);
            } else {
                throw new Error(`Key "${key}" is nonexistent`);
            }
        }
        return unionedTypeMap;
    } catch (error) {
        console.error(
            `${error} when unioning Typed Maps:\n` +
            `Typed Map 1:\n` +
            `${str(convertTypeToTypedJson(typedMap1))}\n` +
            `Typed Map 2:\n` +
            `${str(convertTypeToTypedJson(typedMap2))}`
        );
        process.exit(1);
    }
}

// union Types
function unionTypes(type1, type2) {

    const unionedType = {
        array: null,
        object: null,
        types: null
    };

    // array
    if (!isType.isNull(type1.array) && !isType.isNull(type2.array)) {
        unionedType.array = unionTypes(type1.array, type2.array);
    } else if (!isType.isNull(type1.array)) {
        unionedType.array = type1.array;
    } else if (!isType.isNull(type2.array)) {
        unionedType.array = type2.array;
    }

    // object
    if (!isType.isNull(type1.object) && !isType.isNull(type2.object)) {
        unionedType.object = unionTypedMaps(type1.object, type2.object);
    } else if (!isType.isNull(type1.object)) {
        unionedType.object = type1.object;
    } else if (!isType.isNull(type2.object)) {
        unionedType.object = type2.object;
    }

    // types
    if (!isType.isNull(type1.types) && !isType.isNull(type2.types)) {
        unionedType.types = new Set([...type1.types, ...type2.types]);
    } else if (!isType.isNull(type1.types)) {
        unionedType.types = type1.types;
    } else if (!isType.isNull(type2.types)) {
        unionedType.types = type2.types;
    }

    return unionedType;
}

module.exports = {
    unionTypedMaps,
    unionTypes
};
