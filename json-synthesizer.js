#!/usr/bin/env node
const convertJsontoTypedJson = require('./src/convertJsonToTypedJson');
const mapJson = require('./src/mapJson');
const unifyTypedJson = require('./src/unifyTypedJson');

const specification = {
    inputOutputExamples: [
        {
            source: 'a place',
            input: {
                first: 1,
                second: {
                    inner: 3
                }
            },
            output: null
        }
    ],
    mappingRules: [
        {
            source: 'a place',
            path: ['*', 'inner'],
            mapper: (key, value) => ({
                mappedInner: `${key}'s value is now ${value * 4}`
            })
        }
    ]
};

const nodes = specification.inputOutputExamples.map((io) => {
    const convertedIo = convertJsontoTypedJson(
        mapJson(io.input, specification.mappingRules),
        io.output
    );
    // console.debug(JSON.stringify(convertedIo, null, '--'));
    return convertedIo;
});

const finalTypedJson = nodes.reduce((node1, node2) =>
    unifyTypedJson(node1, node2),
    { type: [], value: {} }
);

console.log(finalTypedJson);
