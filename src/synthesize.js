/**
 * @module {Function} synthesize
 */
const convertJsonToTypedMap = require('./vsa/convertJsonToTypedMap');
const convertTypedMapToTypedJson = require('./vsa/convertTypedMapToTypedJson');
const { intersectTypedMaps } = require('./vsa/intersects');
const mapTransformsOnJson = require('./vsa/mapTransformsOnJson');
const restructureTypedMaps = require('./vsa/restructureTypedMaps');
const { unionTypedMaps } = require('./vsa/unions');
const str = require('./util/str');

/**
 * Synthesize function
 *
 * @description Synthesizes a function based on an specification of input/output
 * examples, transforms, and expected output through a modified version space
 * algebra. See {@link https://json-synthesizer.syall.work/DESIGN.html#specification|here}
 * for more details about the structure of the input specification.
 * @param {Object} spec - Specification for synthesis
 * @returns {string} Synthesized Typed JSON string
 */
function synthesize(spec) {
    try {
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
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = synthesize;
