/**
 * @module {Object} isType
 * @description Collection of utility functions relating to types of values.
 */

/**
 * Tests whether an input is an Array
 *
 * @param {*} input - Input value
 * @returns {boolean} Whether the input is an Array
 */
function isArray(input) {
    return Array.isArray(input);
}

/**
 * Tests whether an input is null
 *
 * @param {*} input - Input value
 * @returns {boolean} Whether the input is null
 */
function isNull(input) {
    return input === null;
}

/**
 * Tests whether an input is an Object
 *
 * @param {*} input - Input value
 * @returns {boolean} Whether the input is an Object
 */
function isObject(input) {
    return input !== null && (typeof input) === 'object';
}

/**
 * Gets the Type of a Single Value
 *
 * @param {(string|null|number|boolean)} input - Input value
 * @returns {string} Type of input
 */
function singleValue(input) {
    return input === null ? 'null' : (typeof input);
}

module.exports = {
    isArray,
    isNull,
    isObject,
    singleValue
};
