const synthesize = require('../../src/synthesize');
const unmarshallDynamoJSON = require('../transforms/unmarshallDynamoJson');

const specification = {
    inputOutputExamples: [
        {
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
                        }
                    ]
                },
                'Address': { 'S': '123 Mulberry Lane' },
                'Count': {
                    'N': '1'
                }
            },
            output: {
                Surname: 'Smith',
                Members: [
                    { Name: 'John' }
                ],
                Count: 1
            }
        }
    ],
    transforms: [
        {
            source: 'DynamoDB',
            transform: unmarshallDynamoJSON
        }
    ]
};

console.log(synthesize(specification));