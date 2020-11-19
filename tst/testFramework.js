const RED = '\033[0;31m';
const GREEN = '\033[0;32m';
const CYAN = '\033[0;36m'
const NC = '\033[0m';

function describe(description, scope) {
    console.log(`${CYAN}${description}${NC}`);
    console.group();
    scope();
    console.groupEnd();
}

function test(description, scope) {
    try {
        scope();
        console.log(`${GREEN}✓${NC}: ${description}`);
    } catch (error) {
        console.log(`${RED}✗${NC}: ${description}`);
        console.error(`${error.message}`);
    }
}

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
