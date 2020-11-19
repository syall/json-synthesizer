const convertTypedMapToTypedJson = require('./convertTypedMapToTypedJson');
const str = require('./util/str');

// restructure Typed Maps
function restructureTypedMaps(typedMap1, typedMap2) {
    try {
        const restructuredTypedMap = new Map();
        for (const [key2, value2] of typedMap2.entries()) {
            if (typedMap1.has(key2)) {
                restructuredTypedMap.set(key2, {
                    prefix: value2.prefix,
                    type: typedMap1.get(key2).type
                });
            } else {
                throw new Error(`Output Key "${key2}" doesn't exist`);
            }
        }
        return restructuredTypedMap;
    } catch (error) {
        console.error(
            `${error} when restructuring Typed Maps:\n` +
            `Typed Map 1:\n` +
            `${str(convertTypedMapToTypedJson(typedMap1))}\n` +
            `Typed Map 2:\n` +
            `${str(convertTypedMapToTypedJson(typedMap2))}`
        );
        process.exit(1);
    }
}

module.exports = restructureTypedMaps;