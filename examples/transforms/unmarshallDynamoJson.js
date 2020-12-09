/**
 * Unmarshall a DynamoDB JSON object to its equivalent JavaScript type.
 *
 * @param {Object} dynamoJson - DynamoDB JSON object
 * @return {Object} Unmarshalled JSON
 */
function unmarshallDynamoJSON(dynamoJson) {
    /**
     * Convert a DynamoDB JSON object to its equivalent JavaScript type.
     *
     * Modified Code from {@link https://github.com/aws/aws-sdk-js/blob/master/lib/dynamodb/converter.js|aws-sdk-js}
     * under Apache License 2.0.
     *
     * @license Apache-2.0
     * @param {Object} input - DynamoDB JSON object
     * @return {Object} Unmarshalled JSON
     */
    function convertOutput(input) {
        for (const type in input) {
            const values = input[type];
            if (type === 'M') {
                const map = {};
                for (const key in values) {
                    map[key] = convertOutput(values[key]);
                }
                return map;
            } else if (
                type === 'L' ||
                type === 'SS' ||
                type === 'NS' ||
                type === 'BS'
            ) {
                const list = [];
                for (let i = 0; i < values.length; i++) {
                    list.push(convertOutput(values[i]));
                }
                return list;
            } else if (
                type === 'S' ||
                type === 'B'
            ) {
                return `${values}`;
            } else if (type === 'N') {
                return Number(values);
            } else if (type === 'BOOL') {
                return (
                    values === 'true' ||
                    values === 'TRUE' ||
                    values === true
                );
            } else if (type === 'NULL') {
                return null;
            }
        }
    }
    return convertOutput({ M: dynamoJson });
}

module.exports = unmarshallDynamoJSON;
