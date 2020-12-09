const synthesize = require('./src/synthesize');
const convertJsonToTypedMap = require('./src/vsa/convertJsonToTypedMap');
const convertTypedMapToTypedJson = require('./src/vsa/convertTypedMapToTypedJson');
const intersects = require('./src/vsa/intersects');
const mapTransformsOnJson = require('./src/vsa/mapTransformsOnJson');
const restructureTypedMaps = require('./src/vsa/restructureTypedMaps');
const unions = require('./src/vsa/unions');
const isType = require('./src/util/isType');
const str = require('./src/util/str');

/**
 * Default Export
 */
module.exports = synthesize;

/**
 * Version Space Algebra
 */
module.exports.vsa = {
    convertJsonToTypedMap,
    convertTypedMapToTypedJson,
    intersects,
    mapTransformsOnJson,
    restructureTypedMaps,
    unions
};

/**
 * Utilities
 */
module.exports.util = {
    isType,
    str
};
