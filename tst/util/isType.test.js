const { describe, test, assertTest } = require('../testFramework');
const { isArray, isNull, isObject, singleValue } = require('../../src/util/isType');

describe('Tests for isArray', () => {

    test('Test String Type', () => {
        assertTest(false, isArray(''));
    });

    test('Test Number Type', () => {
        assertTest(false, isArray(0));
    });

    test('Test Boolean Type', () => {
        assertTest(false, isArray(true));
        assertTest(false, isArray(false));
    });

    test('Test Null Type', () => {
        assertTest(false, isArray(null));
    });

    test('Test Array Type', () => {
        assertTest(true, isArray([]));
    });

    test('Test Object Type', () => {
        assertTest(false, isArray({}));
    });

});

describe('Tests for isNull', () => {

    test('Test String Type', () => {
        assertTest(false, isNull(''));
    });

    test('Test Number Type', () => {
        assertTest(false, isNull(0));
    });

    test('Test Boolean Type', () => {
        assertTest(false, isNull(true));
        assertTest(false, isNull(false));
    });

    test('Test Null Type', () => {
        assertTest(true, isNull(null));
    });

    test('Test Array Type', () => {
        assertTest(false, isNull([]));
    });

    test('Test Object Type', () => {
        assertTest(false, isNull({}));
    });

});

describe('Tests for isObject', () => {

    test('Test String Type', () => {
        assertTest(false, isObject(''));
    });

    test('Test Number Type', () => {
        assertTest(false, isObject(0));
    });

    test('Test Boolean Type', () => {
        assertTest(false, isObject(true));
        assertTest(false, isObject(false));
    });

    test('Test Null Type', () => {
        assertTest(false, isObject(null));
    });

    test('Test Array Type', () => {
        assertTest(false, isObject([]));
    });

    test('Test Object Type', () => {
        assertTest(true, isObject({}));
    });

});

describe('Tests for singleValue', () => {

    test('Test String Type', () => {
        assertTest('string', singleValue('value'));
    });

    test('Test Number Type', () => {
        assertTest('number', singleValue(0));
    });

    test('Test Boolean Type', () => {
        assertTest('boolean', singleValue(true));
        assertTest('boolean', singleValue(false));
    });

    test('Test Null Type', () => {
        assertTest('null', singleValue(null));
    });

});
