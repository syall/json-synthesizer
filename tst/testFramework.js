/**
 * @module {Object} testFramework
 * @description Simple Test Framework inspired by Jest
 */

/**
 * ANSI Escape Color Code Red
 */
const RED = '\x1b[0;31m';

/**
 * ANSI Escape Color Code Green
 */
const GREEN = '\x1b[0;32m';

/**
 * ANSI Escape Color Code Yellow
 */
const YELLOW = '\x1b[0;33m';

/**
 * ANSI Escape Color Code Cyan
 */
const CYAN = '\x1b[0;36m';

/**
 * ANSI Escape Color Code Reset Color
 */
const NC = '\x1b[0m';

/**
 * Test Suite Function
 *
 * Outputs description and indents encapsulated output.
 *
 * @param {string} description - Description of Test Suite
 * @param {Function} scope - Scope of Test Suite
 */
function describe(description, scope) {
    if (scope === undefined) {
        console.log(`${YELLOW}${description}${NC}`);
    } else {
        console.log(`${CYAN}${description}${NC}`);
        console.group();
        scope();
        console.groupEnd();
    }
}

/**
 * Test Function
 *
 * Outputs whether a test passed or failed with the description.
 *
 * @param {string} description - Description of Test
 * @param {Function} scope - Scope of Test
 */
function test(description, scope) {
    if (scope === undefined) {
        console.log(`${YELLOW}?${NC} : ${description}`);
    } else {
        try {
            scope();
            console.log(`${GREEN}✓${NC} : ${description}`);
        } catch (error) {
            console.log(`${RED}✗${NC} : ${description}`);
            const [_, file, row, col] = error.stack
                .split('\n')
                .filter(l => l.includes('test.js:'))[0]
                .match(/(\/tst\/.+\.test\.js):(\d+):(\d+)$/);
            console.error(`${RED}Error at${NC} ${file}:${row}:${col}`);
            console.group();
            console.error(`${error.message}`);
            console.groupEnd();
        }
    }
}

/**
 * Assertion
 *
 * @param {*} expected - Expected Value
 * @param {*} actual - Actual Value
 * @throws Throws an error if expected !== actual
 */
function assertTest(expected, actual) {
    if (expected !== actual) {
        throw new Error(
            `${RED}Expected${NC}: ${expected}\n` +
            `${RED}Actual${NC}: ${actual}`
        );
    }
}

module.exports = {
    describe,
    test,
    assertTest
};
