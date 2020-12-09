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
        },
        {
            source: [],
            input: {
                'Pets': [
                    {
                        'Name': 'Fido',
                        'Type': 'Dog',
                        'Age': 7,
                        'Rescued': false
                    },
                    {
                        'Name': 'Polly',
                        'Type': 'Parrot',
                        'Age': 2,
                        'Color': 'Red'
                    }
                ]
            },
            output: {
                Other: {
                    Pets: [
                        {
                            'Name': 'Name',
                            'Type': 'Type',
                            'Age': 0,
                            'Rescued': true
                        }
                    ]
                }
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