/**
 * @module {Function} str
 */

/**
 * Stringify any Value
 *
 * @param {*} input - Input Value
 * @returns {string} Stringified Input
 */
function str(input) {
    return JSON.stringify(input, null, 4);
}

module.exports = str;
