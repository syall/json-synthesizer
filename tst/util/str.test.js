const { describe, test, assertTest } = require('../testFramework');
const str = require('../../src/util/str');

describe('Tests for str', () => {

    test('Test String Value', () => {
        assertTest('"value"', str('value'));
    });

    test('Test Number Value', () => {
        assertTest('0', str(0));
    });

    test('Test Boolean Value', () => {
        assertTest('true', str(true));
        assertTest('false', str(false));
    });

    test('Test Null Value', () => {
        assertTest('null', str(null));
    });

    test('Test Array Value', () => {
        assertTest(
            '[\n' +
            '    1,\n' +
            '    2\n' +
            ']',
            str([1, 2])
        );
    });

    test('Test Object Value', () => {
        assertTest(
            '{\n' +
            '    "a": "value",\n' +
            '    "b": {\n' +
            '        "c": 1\n' +
            '    }\n' +
            '}',
            str({
                a: 'value',
                b: {
                    c: 1
                }
            })
        )
    });

});