const { describe, test, assertTest } = require('./testFramework');
const synthesize = require('../src/synthesize');
const str = require('../src/util/str');

describe('Test Units', () => {

    const transformIOExample = {
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
                d: 'hello',
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

    const restructureIOExample = {
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

    const arraySingleIOExample = {
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
                ],
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

    const arrayObjectIOExample = {
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
                ],
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

    const arrayArrayIOExample = {
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
                    [54, { boom: 4 }],
                ],
            },
            output: {
                arrayTest: [
                    ['inner', false],
                    [54, { boom: 4 }],
                ]
            }
        }
    };

    const omitIOExample = {
        expectedOutput: {},
        example: {
            source: [],
            input: {
                omit: true
            },
            output: {}
        }
    };

    function renameTransform(path, name, rename) {

        function isObject(input) {
            return (
                input !== null &&
                typeof input === 'object'
            );
        }

        function transformHelper(input) {
            transformSearch(input);
            return input;
        }

        function transformSearch(input, search = path) {
            if (search.length === 0) {
                if (input[name] !== undefined) {
                    const temp = input[name];
                    delete input[name];
                    input[rename] = temp;
                }
            } else {
                const [head, ...rest] = search;
                if (head === '*') {
                    for (const v of Object.values(input)) {
                        if (isObject(v)) {
                            transformSearch(v, rest);
                        }
                    }
                } else if (isObject(input[head])) {
                    transformSearch(input[head], rest);
                }
            }
        };

        return transformHelper;
    }

    const transforms = [
        {
            source: 'whatever-to-whenever Transform',
            transform: renameTransform(['outer', 'inner'], 'whatever', 'whenever'),
        },
        {
            source: 'whenever-to-key Transform',
            transform: renameTransform(['*', '*'], 'whenever', 'key'),
        }
    ];

    test('Test Rename Transform', () => {

        const specification = {
            inputOutputExamples: [
                transformIOExample.example
            ],
            transforms
        };

        assertTest(
            str(transformIOExample.expectedOutput),
            synthesize(specification)
        );
    });

    test('Test Restructuring', () => {

        const specification = {
            inputOutputExamples: [
                restructureIOExample.example
            ],
            transforms: []
        };

        assertTest(
            str(restructureIOExample.expectedOutput),
            synthesize(specification)
        );
    });

    test('Test Unioning Array Single Types', () => {

        const specification = {
            inputOutputExamples: [
                arraySingleIOExample.example
            ],
            transforms: []
        };

        assertTest(
            str(arraySingleIOExample.expectedOutput),
            synthesize(specification)
        );
    });

    test('Test Unioning Array Object Types', () => {

        const specification = {
            inputOutputExamples: [
                arrayObjectIOExample.example
            ],
            transforms: []
        };

        assertTest(
            str(arrayObjectIOExample.expectedOutput),
            synthesize(specification)
        );
    });

    test('Test Unioning Array Array Types', () => {

        const specification = {
            inputOutputExamples: [,
                arrayArrayIOExample.example
            ],
            transforms: []
        };

        assertTest(
            str(arrayArrayIOExample.expectedOutput),
            synthesize(specification)
        );
    });

    test('Test Intersecting Omitting', () => {

        const specification = {
            inputOutputExamples: [
                omitIOExample.example
            ],
            transforms: []
        };

        assertTest(
            str(omitIOExample.expectedOutput),
            synthesize(specification)
        );
    });

    test('Test Unioning Multiple I/O Examples', () => {

        const expectedOutput = {
            ...transformIOExample.expectedOutput,
            ...restructureIOExample.expectedOutput,
            ...{
                arrayTest: {
                    array: {
                        array: arrayArrayIOExample.expectedOutput.arrayTest.array.array,
                        object: arrayObjectIOExample.expectedOutput.arrayTest.array.object,
                        types: arraySingleIOExample.expectedOutput.arrayTest.array.types
                    },
                    object: null,
                    types: null
                }
            },
            ...omitIOExample.expectedOutput
        };

        const specification = {
            inputOutputExamples: [
                transformIOExample.example,
                restructureIOExample.example,
                arraySingleIOExample.example,
                arrayObjectIOExample.example,
                arrayArrayIOExample.example,
                omitIOExample.example
            ],
            transforms
        };

        assertTest(
            str(expectedOutput),
            synthesize(specification)
        );
    });

});
