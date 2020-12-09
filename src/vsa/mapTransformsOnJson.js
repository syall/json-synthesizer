/**
 * @module {Function} mapTransformsOnJson
 */
const str = require('../util/str');

/**
 * Map applicable Transforms on JSON based on source
 *
 * @param {Object} io - Input/Output Example with input to Transform
 * @param {Object[]} transforms - Array of transforms
 * @returns {Object} Transformed input JSON
 * @throws Throws an error if error occurred when mapping Transforms on JSON
 */
function mapTransformsOnJson(io, transforms) {
    try {
        const filteredTransforms = transforms.filter(t => io.source.includes(t.source));
        let mappedJson = io.input;
        for (const { transform } of filteredTransforms) {
            mappedJson = transform(mappedJson);
        }
        return mappedJson;
    } catch (error) {
        throw new Error(
            `${error} when mapping Transforms on JSON\n` +
            `Source: ${io.source}\n` +
            `JSON: ${str(io.input)}`
        );
    }
}

module.exports = mapTransformsOnJson;
