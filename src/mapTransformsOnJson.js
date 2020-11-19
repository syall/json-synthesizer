const str = require('./util/str');

// map JSON with mappingRules
function mapTransformsOnJson(io, transforms) {
    try {
        const filteredTransforms = transforms.filter(t => io.source.includes(t.source));
        let mappedJson = io.input;
        for (const { transform } of filteredTransforms) {
            mappedJson = transform(mappedJson);
        }
        return mappedJson;
    } catch (error) {
        console.error(
            `${error} when mapping Transforms on JSON\n` +
            `Source: ${io.source}\n` +
            `JSON: ${str(io.input)}`
        );
        console.error(error);
        process.exit(1);
    }
}

module.exports = mapTransformsOnJson;
