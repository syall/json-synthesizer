const { describe, test, assertTest } = require('../testFramework');
const mapTransformsOnJson = require('../../src/vsa/mapTransformsOnJson');
const str = require('../../src/util/str');

describe('Tests for mapTransformsOnJson', () => {

    const io = {
        source: ['tag1', 'tag2', 'generic'],
        input: {
            a: 'value'
        }
    };

    test('Test Empty Transforms', () => {
        const transforms = [];
        assertTest(str(io.input), str(mapTransformsOnJson(io, transforms)));
    });

    test('Test Filtering Unapplicable Transforms', () => {
        const transforms = [
            {
                source: 'unapplicable1',
                transform: _ => undefined
            },
            {
                source: 'unapplicable2',
                transform: _ => null
            }
        ];
        assertTest(str(io.input), str(mapTransformsOnJson(io, transforms)));
    });

    test('Test Mapping Applicable Transforms', () => {
        const transforms = [
            {
                source: 'tag1',
                transform: _ => 'tag1 worked'
            },
            {
                source: 'tag2',
                transform: input => input === 'tag1 worked'
                    ? 'tag2 worked'
                    : undefined
            }
        ];
        assertTest('tag2 worked', mapTransformsOnJson(io, transforms));
    });

    test('Test Mapping Generic Transform', () => {
        const transforms = [
            {
                source: 'generic',
                transform: json => {
                    const temp = json.a;
                    json.b = temp;
                    delete json.a;
                    return json;
                }
            }
        ];
        assertTest(str({ b: 'value' }), str(mapTransformsOnJson(io, transforms)));
    });

});