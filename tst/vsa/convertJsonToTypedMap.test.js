const { describe, test, assertTest } = require('../testFramework');
const convertJsonToTypedMap = require('../../src/vsa/convertJsonToTypedMap');
const str = require('../../src/util/str');

describe('Tests for convertJsonToTypedMap', () => {

    test('Convert Empty Object', () => {
        const input = {};
        const typedMap = convertJsonToTypedMap(input);
        assertTest(0, typedMap.size);
    });

    test('Convert String Value', () => {
        const input = {
            a: 'value'
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(1, typedMap.size);
        assertTest(true, typedMap.has('a'));
        const { prefix, type } = typedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('string'));
    });

    test('Convert Number Value', () => {
        const input = {
            a: 0
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(1, typedMap.size);
        assertTest(true, typedMap.has('a'));
        const { prefix, type } = typedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('number'));
    });

    test('Convert Boolean Value', () => {
        const input = {
            a: true
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(1, typedMap.size);
        assertTest(true, typedMap.has('a'));
        const { prefix, type } = typedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('boolean'));
    });

    test('Convert Null Value', () => {
        const input = {
            a: null
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(1, typedMap.size);
        assertTest(true, typedMap.has('a'));
        const { prefix, type } = typedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('null'));
    });

    test('Convert Key Value with Prefix', () => {
        const input = {
            c: {
                b: {
                    a: 'value'
                }
            }
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(1, typedMap.size);
        assertTest(true, typedMap.has('a'));
        const { prefix, type } = typedMap.get('a');
        assertTest(2, prefix.length);
        assertTest(str(['c', 'b']), str(prefix));
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('string'));
    });

    test('Convert Multiple Key Values', () => {
        const input = {
            a: 'value',
            b: 'value',
            d: {
                c: 'value'
            }
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(3, typedMap.size);
        assertTest(true, typedMap.has('a'));
        assertTest(true, typedMap.has('b'));
        assertTest(true, typedMap.has('c'));
        let value = typedMap.get('a');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
        value = typedMap.get('b');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
        value = typedMap.get('c');
        assertTest(1, value.prefix.length);
        assertTest(str(['d']), str(value.prefix));
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
    });

    test('Convert Array Value with Single Types', () => {
        const input = {
            a: [
                '',
                0,
                false,
                null
            ]
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(1, typedMap.size);
        assertTest(true, typedMap.has('a'));
        const { prefix, type } = typedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array.array);
        assertTest(null, type.array.object);
        assertTest(4, type.array.types.size);
        assertTest(true, type.array.types.has('string'));
        assertTest(true, type.array.types.has('number'));
        assertTest(true, type.array.types.has('boolean'));
        assertTest(true, type.array.types.has('null'));
        assertTest(null, type.object);
        assertTest(null, type.types);
    });

    test('Convert Array Value with Array Type', () => {
        const input = {
            a: [
                [''],
                [0],
                [false],
                [null],
                []
            ]
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(1, typedMap.size);
        assertTest(true, typedMap.has('a'));
        const { prefix, type } = typedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(4, type.array.array.types.size);
        assertTest(true, type.array.array.types.has('string'));
        assertTest(true, type.array.array.types.has('number'));
        assertTest(true, type.array.array.types.has('boolean'));
        assertTest(true, type.array.array.types.has('null'));
        assertTest(null, type.array.object);
        assertTest(null, type.array.types);
        assertTest(null, type.object);
        assertTest(null, type.types);
    });

    test('Convert Array Value with Object Type', () => {
        const input = {
            a: [
                {
                    a: ''
                },
                {
                    a: 0
                },
                {
                    a: false
                },
                {
                    a: null
                },
                {
                    c: {
                        b: 'other'
                    }
                },
                {}
            ]
        };
        const typedMap = convertJsonToTypedMap(input);
        assertTest(1, typedMap.size);
        assertTest(true, typedMap.has('a'));
        const { prefix, type } = typedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array.array);
        assertTest(2, type.array.object.size);
        assertTest(true, type.array.object.has('a'));
        let value = type.array.object.get('a');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(4, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
        assertTest(true, value.type.types.has('number'));
        assertTest(true, value.type.types.has('boolean'));
        assertTest(true, value.type.types.has('null'));
        assertTest(true, type.array.object.has('b'));
        value = type.array.object.get('b');
        assertTest(1, value.prefix.length);
        assertTest(str(['c']), str(value.prefix));
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
        assertTest(null, type.array.types);
        assertTest(null, type.object);
        assertTest(null, type.types);
    });

    test('Fail to Convert Duplicate Keys', () => {
        const input = {
            a: 'value1',
            b: {
                a: 'value2'
            }
        };
        try {
            convertJsonToTypedMap(input);
            throw new Error();
        } catch (_) { }
    });

});