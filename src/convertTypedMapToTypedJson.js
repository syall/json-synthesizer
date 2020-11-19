const isType = require('./util/isType');

// convert Typed Map to Typed Json
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
        console.error(`${error} when converting Typed Map to Typed JSON`);
        process.exit(1);
    }
}

// convert Type to Typed JSON router
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
