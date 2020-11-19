const convertJsonToTypedMap = require('./convertJsonToTypedMap');
const convertTypedMapToTypedJson = require('./convertTypedMapToTypedJson');
const { intersectTypedMaps } = require('./intersects');
const mapTransformsOnJson = require('./mapTransformsOnJson');
const restructureTypedMaps = require('./restructureTypedMaps');
const { unionTypedMaps } = require('./unions');
const str = require('./util/str');

// Synthesize Specification
function synthesize(spec) {

    // Convert Input/Output Examples into Typed Maps
    const typedMaps = spec.inputOutputExamples.map(io => {

        // Map Mapping Rules to JSON
        const mappedJson = mapTransformsOnJson(io, spec.transforms);

        // Intersect Input and Output
        const typedMapInput = convertJsonToTypedMap(mappedJson);
        const typedMapOutput = convertJsonToTypedMap(io.output);
        const restructuredTypedMapInput = restructureTypedMaps(
            typedMapInput,
            typedMapOutput
        );
        const intersectedTypedMap = intersectTypedMaps(
            restructuredTypedMapInput,
            typedMapOutput
        );

        return intersectedTypedMap;
    });

    // Union Input/Output Examples into a Single Typed Map
    const unionedTypedMap = typedMaps.reduce(
        (typedMap1, typedMap2) => unionTypedMaps(typedMap1, typedMap2),
        new Map()
    );

    // Convert Typed Map into Typed JSON
    const unionedTypedJson = convertTypedMapToTypedJson(unionedTypedMap);

    // Synthesized Typed JSON String
    return str(unionedTypedJson);
}

module.exports = synthesize;
