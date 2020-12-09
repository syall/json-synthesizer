const { describe, test, assertTest } = require('./testFramework');
const synthesize = require('../src/synthesize');
const str = require('../src/util/str');
const renameTransform = require('../examples/transforms/renameTransform');
const unmarshallDynamoJSON = require('../examples/transforms/unmarshallDynamoJson');

describe('Tests (Generic Black Box) for synthesize', () => {

    const transforms = [
        {
            source: 'whatever-to-whenever Transform',
            transform: renameTransform(['outer', 'inner'], 'whatever', 'whenever')
        },
        {
            source: 'whenever-to-key Transform',
            transform: renameTransform(['*', '*'], 'whenever', 'key')
        }
    ];

    const transformIoExample = {
        expectedOutput: {
            'a': {
                'array': null,
                'object': {
                    'b': {
                        'array': null,
                        'object': {
                            'c': {
                                'array': null,
                                'object': {
                                    'key': {
                                        'array': null,
                                        'object': null,
                                        'types': [
                                            'string'
                                        ]
                                    }
                                },
                                'types': null
                            },
                            'd': {
                                'array': null,
                                'object': null,
                                'types': [
                                    'string'
                                ]
                            }
                        },
                        'types': null
                    }
                },
                'types': null
            }
        },
        example: {
            source: [
                'whatever-to-whenever Transform',
                'whenever-to-key Transform'
            ],
            input: {
                outer: {
                    inner: {
                        whatever: 'JSON'
                    }
                },
                d: 'hello'
            },
            output: {
                a: {
                    b: {
                        c: {
                            key: 'JSON'
                        },
                        d: 'hello'
                    }
                }
            }
        }
    };

    test('Test renameTransform Transform', () => {

        const specification = {
            inputOutputExamples: [
                transformIoExample.example
            ],
            transforms
        };

        assertTest(
            str(transformIoExample.expectedOutput),
            synthesize(specification)
        );
    });

    const restructureIoExample = {
        expectedOutput: {
            'inner': {
                'array': null,
                'object': {
                    'second': {
                        'array': null,
                        'object': null,
                        'types': [
                            'number'
                        ]
                    }
                },
                'types': null
            },
            'outer': {
                'array': null,
                'object': null,
                'types': [
                    'number'
                ]
            }
        },
        example: {
            source: [],
            input: {
                second: 2,
                inner: {
                    outer: 4
                }
            },
            output: {
                inner: {
                    second: 2
                },
                outer: 4
            }
        }
    };

    test('Test Restructuring', () => {

        const specification = {
            inputOutputExamples: [
                restructureIoExample.example
            ],
            transforms: []
        };

        assertTest(
            str(restructureIoExample.expectedOutput),
            synthesize(specification)
        );
    });

    const arraySingleIoExample = {
        expectedOutput: {
            'arrayTest': {
                'array': {
                    'array': null,
                    'object': null,
                    'types': [
                        'string',
                        'number',
                        'boolean',
                        'null'
                    ]
                },
                'object': null,
                'types': null
            }
        },
        example: {
            source: [],
            input: {
                arrayTest: [
                    'a',
                    1,
                    true,
                    null,
                    'string'
                ]
            },
            output: {
                arrayTest: [
                    'a',
                    1,
                    true,
                    null,
                    'string'
                ]
            }
        }

    };

    test('Test Unioning Array Single Types', () => {

        const specification = {
            inputOutputExamples: [
                arraySingleIoExample.example
            ],
            transforms: []
        };

        assertTest(
            str(arraySingleIoExample.expectedOutput),
            synthesize(specification)
        );
    });

    const arrayObjectIoExample = {
        expectedOutput: {
            'arrayTest': {
                'array': {
                    'array': null,
                    'object': {
                        'b': {
                            'array': null,
                            'object': null,
                            'types': [
                                'null'
                            ]
                        },
                        'c': {
                            'array': null,
                            'object': null,
                            'types': [
                                'null',
                                'number'
                            ]
                        }
                    },
                    'types': null
                },
                'object': null,
                'types': null
            }
        },
        example: {
            source: ['Object Typed Maps Union'],
            input: {
                arrayTest: [
                    { b: null },
                    { c: null },
                    { c: 1 }
                ]
            },
            output: {
                arrayTest: [
                    { b: null },
                    { c: null },
                    { c: 1 }
                ]
            }
        }
    };

    test('Test Unioning Array Object Types', () => {

        const specification = {
            inputOutputExamples: [
                arrayObjectIoExample.example
            ],
            transforms: []
        };

        assertTest(
            str(arrayObjectIoExample.expectedOutput),
            synthesize(specification)
        );
    });

    const arrayArrayIoExample = {
        expectedOutput: {
            'arrayTest': {
                'array': {
                    'array': {
                        'array': null,
                        'object': {
                            'boom': {
                                'array': null,
                                'object': null,
                                'types': [
                                    'number'
                                ]
                            }
                        },
                        'types': [
                            'string',
                            'boolean',
                            'number'
                        ]
                    },
                    'object': null,
                    'types': null
                },
                'object': null,
                'types': null
            }
        },
        example: {
            source: [],
            input: {
                arrayTest: [
                    ['inner', false],
                    [54, { boom: 4 }]
                ]
            },
            output: {
                arrayTest: [
                    ['inner', false],
                    [54, { boom: 4 }]
                ]
            }
        }
    };

    test('Test Unioning Array Array Types', () => {

        const specification = {
            inputOutputExamples: [,
                arrayArrayIoExample.example
            ],
            transforms: []
        };

        assertTest(
            str(arrayArrayIoExample.expectedOutput),
            synthesize(specification)
        );
    });

    const omitIoExample = {
        expectedOutput: {},
        example: {
            source: [],
            input: {
                omit: true
            },
            output: {}
        }
    };

    test('Test Intersecting Omitting', () => {

        const specification = {
            inputOutputExamples: [
                omitIoExample.example
            ],
            transforms: []
        };

        assertTest(
            str(omitIoExample.expectedOutput),
            synthesize(specification)
        );
    });

    const restructureObjectIoExample = {
        expectedOutput: {
            ob: {
                array: {
                    array: null,
                    object: {
                        ject: {
                            array: null,
                            object: {
                                example: {
                                    array: null,
                                    object: {
                                        a: {
                                            array: null,
                                            object: null,
                                            types: [
                                                'number',
                                                'string'
                                            ]
                                        }
                                    },
                                    types: null
                                }
                            },
                            types: null
                        }
                    },
                    types: null
                },
                object: null,
                types: null
            }
        },
        example: {
            source: [],
            input: {
                ob: [
                    {
                        a: 2
                    },
                    {
                        a: 'value'
                    }
                ]
            },
            output: {
                ob: [
                    {
                        ject: {
                            example: {
                                a: 2
                            }
                        }
                    },
                    {
                        ject: {
                            example: {
                                a: 'value'
                            }
                        }
                    }
                ]
            }
        }
    };

    test('Test Restructuring Objects', () => {
        const specification = {
            inputOutputExamples: [
                restructureObjectIoExample.example
            ],
            transforms: []
        };

        assertTest(
            str(restructureObjectIoExample.expectedOutput),
            synthesize(specification)
        );
    });

    test('Test Unioning Multiple Examples', () => {

        const expectedOutput = {
            ...transformIoExample.expectedOutput,
            ...restructureIoExample.expectedOutput,
            ...{
                arrayTest: {
                    array: {
                        array: arrayArrayIoExample.expectedOutput.arrayTest.array.array,
                        object: arrayObjectIoExample.expectedOutput.arrayTest.array.object,
                        types: arraySingleIoExample.expectedOutput.arrayTest.array.types
                    },
                    object: null,
                    types: null
                }
            },
            ...omitIoExample.expectedOutput,
            ...restructureObjectIoExample.expectedOutput
        };

        const specification = {
            inputOutputExamples: [
                transformIoExample.example,
                restructureIoExample.example,
                arraySingleIoExample.example,
                arrayObjectIoExample.example,
                arrayArrayIoExample.example,
                omitIoExample.example,
                restructureObjectIoExample.example
            ],
            transforms
        };

        assertTest(
            str(expectedOutput),
            synthesize(specification)
        );
    });

});

describe('Tests (DynamoDB Black Box) for synthesize', () => {

    const transforms = [
        {
            source: 'DynamoDB',
            transform: unmarshallDynamoJSON
        }
    ];

    const petIoExample = {
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

    test('Test unmarshallDynamoJson Transform', () => {

        const specification = {
            inputOutputExamples: [
                petIoExample.example
            ],
            transforms
        };

        assertTest(
            str(petIoExample.expectedOutput),
            synthesize(specification)
        );
    });

    const familyIoExample = {
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
                                'Age': { 'N': '2' }
                            }
                        }
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
                        Age: 2
                    }
                ],
                Address: '123 Mulberry Lane',
                Count: 4
            }
        }
    };

    test('Test Multiple DynamoDB Examples', () => {

        const expectedOutput = {
            ...petIoExample.expectedOutput,
            ...familyIoExample.expectedOutput
        };

        const specification = {
            inputOutputExamples: [
                petIoExample.example,
                familyIoExample.example
            ],
            transforms
        };

        assertTest(
            str(expectedOutput),
            synthesize(specification)
        );
    });

});

