const handleError = require('./utils/handleError');
const unifyTypedJson = require('./unifyTypedJson');
const nyi = require('./utils/nyi');

function convertJsontoTypedJson(input, output) {
    try {
        const convertedJson = convertJson(input);
        const filteredJson = filterJson(convertedJson, output);
        return filteredJson;
    } catch (e) {
        handleError(e);
    }
}

function convertJson(input) {
    nyi(`convertJson`);
    // if (Array.isArray(input)) {
    //     return convertArray(input);
    // } else if ((typeof input === 'object') && (input !== null)) {
    //     return convertObject(input);
    // } else {
    //     return { type: [typeof input] };
    // }
}

function convertArray(input) {
    nyi(`convertArray`);
    // const typedJson = { type: [], value: {} };
    // for (const item in input) {
    //     unifyTypedJson(typedJson, convertJson(item));
    // }
    // return typedJson;
}

function convertObject(obj) {
    nyi(`convertObject`);
    // const typedJson = { type: [typeof obj], value: {} };
    // for (const [key, value] of Object.entries(obj)) {
    //     typedJson.value[key] = convertJson(value);
    // }
    // return typedJson;
}

function filterJson(input, output) {
    nyi(`filterJson`);
}

module.exports = convertJsontoTypedJson;
