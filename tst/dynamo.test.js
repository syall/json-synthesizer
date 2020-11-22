const { describe, test, assertTest } = require('./testFramework');
const synthesize = require('../src/synthesize');
const str = require('../src/util/str');

describe('Test DynamoDB', () => {

    const petIOExample = {
        expectedOutput: {
            'Age': {
                'array': null,
                'object': null,
                'types': [
                    'number'
                ]
            },
            'Colors': {
                'array': {
                    'array': null,
                    'object': null,
                    'types': [
                        'string'
                    ]
                },
                'object': null,
                'types': null
            },
            'Name': {
                'array': null,
                'object': null,
                'types': [
                    'string'
                ]
            },
            'Vaccinations': {
                'array': null,
                'object': {
                    'Rabies': {
                        'array': {
                            'array': null,
                            'object': null,
                            'types': [
                                'string'
                            ]
                        },
                        'object': null,
                        'types': null
                    },
                    'Distemper': {
                        'array': null,
                        'object': null,
                        'types': [
                            'string'
                        ]
                    }
                },
                'types': null
            },
            'Breed': {
                'array': null,
                'object': null,
                'types': [
                    'string'
                ]
            },
            'AnimalType': {
                'array': null,
                'object': null,
                'types': [
                    'string'
                ]
            }
        },
        example: {
            source: ['DynamoDB'],
            input: {
                'Age': { 'N': '8' },
                'Colors': {
                    'L': [
                        { 'S': 'White' },
                        { 'S': 'Brown' },
                        { 'S': 'Black' }
                    ]
                },
                'Name': { 'S': 'Fido' },
                'Vaccinations': {
                    'M': {
                        'Rabies': {
                            'L': [
                                { 'S': '2009-03-17' },
                                { 'S': '2011-09-21' },
                                { 'S': '2014-07-08' }
                            ]
                        },
                        'Distemper': { 'S': '2015-10-13' }
                    }
                },
                'Breed': { 'S': 'Beagle' },
                'AnimalType': { 'S': 'Dog' }
            },
            output: {
                Age: 8,
                Colors: [
                    'White',
                    'Brown',
                    'Black'
                ],
                Name: 'Fido',
                Vaccinations: {
                    Rabies: [
                        '2009-03-17',
                        '2011-09-21',
                        '2014-07-08'
                    ],
                    Distemper: '2015-10-13'
                },
                Breed: 'Beagle',
                AnimalType: 'Dog'
            }
        }
    };

    const familyIOExample = {
        expectedOutput: {
            Surname: {
                array: null,
                object: null,
                types: [
                    'string'
                ]
            },
            Members: {
                array: {
                    array: null,
                    object: {
                        Name: {
                            array: null,
                            object: null,
                            types: [
                                'string'
                            ]
                        },
                        Age: {
                            array: null,
                            object: null,
                            types: [
                                'number'
                            ]
                        },
                        Education: {
                            array: null,
                            object: null,
                            types: [
                                'string'
                            ]
                        }
                    },
                    types: null
                },
                object: null,
                types: null
            },
            Address: {
                array: null,
                object: null,
                types: [
                    'string'
                ]
            },
            Count: {
                array: null,
                object: null,
                types: [
                    'number'
                ]
            }
        },
        example: {
            source: ['DynamoDB'],
            input: {
                'Surname': { 'S': 'Smith' },
                'Members': {
                    'L': [
                        {
                            'M': {
                                'Name': { 'S': 'John' },
                                'Age': { 'N': '34' },
                                'Education': { 'S': 'GED' }
                            }
                        },
                        {
                            'M': {
                                'Name': { 'S': 'Jane' },
                                'Age': { 'N': '32' },
                                'Education': { 'S': 'PHD' }
                            }
                        },
                        {
                            'M': {
                                'Name': { 'S': 'Jack' },
                                'Age': { 'N': '2' },
                                'Education': { 'S': 'N/A' }
                            }
                        },
                    ]
                },
                'Address': { 'S': '123 Mulberry Lane' },
                'Count': { 'N': '4' }
            },
            output: {
                Surname: 'Smith',
                Members: [
                    {
                        Name: 'John',
                        Age: 34,
                        Education: 'GED'
                    },
                    {
                        Name: 'Jane',
                        Age: 32,
                        Education: 'PHD'
                    },
                    {
                        Name: 'Jack',
                        Age: 2,
                        Education: 'N/A'
                    },
                ],
                Address: '123 Mulberry Lane',
                Count: 4
            }
        }
    };

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

    const transforms = [
        {
            source: 'DynamoDB',
            transform: unmarshallDynamoJSON
        }
    ];

    test('Test Unmarshall Transform', () => {

        const specification = {
            inputOutputExamples: [
                petIOExample.example
            ],
            transforms
        };

        assertTest(
            str(petIOExample.expectedOutput),
            synthesize(specification)
        );
    });

    test('Test Unioning DynamoDB', () => {

        const expectedOutput = {
            ...petIOExample.expectedOutput,
            ...familyIOExample.expectedOutput
        };

        const specification = {
            inputOutputExamples: [
                petIOExample.example,
                familyIOExample.example
            ],
            transforms
        };

        assertTest(
            str(expectedOutput),
            synthesize(specification)
        );
    });

});
