const synthesize = require('../../src/synthesize');

const specification = {
    inputOutputExamples: [
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
    transforms: []
};

console.log(synthesize(specification));