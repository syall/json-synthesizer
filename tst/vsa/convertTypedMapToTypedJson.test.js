const { describe, test, assertTest } = require('../testFramework');
const convertTypedMapToTypedJson = require('../../src/vsa/convertTypedMapToTypedJson');
const str = require('../../src/util/str');

describe('Tests for convertTypedMapToTypedJson', () => {

    test('Convert Empty Typed Map', () => {
        const typedMap = new Map();
        assertTest(
            str({}),
            str(convertTypedMapToTypedJson(typedMap))
        );
    });

    test('Convert Single Type Keys', () => {
        const typedMap = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string',
                        'number',
                        'boolean',
                        'null'
                    ])
                }
            }]
        ]);
        assertTest(
            str({
                a: {
                    array: null,
                    object: null,
                    types: [
                        'string',
                        'number',
                        'boolean',
                        'null'
                    ]
                }
            }),
            str(convertTypedMapToTypedJson(typedMap))
        );
    });

    test('Convert Key with Prefix', () => {
        const typedMap = new Map([
            ['a', {
                prefix: ['c', 'b'],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }]
        ]);
        assertTest(
            str({
                c: {
                    array: null,
                    object: {
                        b: {
                            array: null,
                            object: {
                                a: {
                                    array: null,
                                    object: null,
                                    types: [
                                        'string'
                                    ]
                                }
                            },
                            types: null
                        }
                    },
                    types: null
                }
            }),
            str(convertTypedMapToTypedJson(typedMap))
        );
    });

    test('Convert Multiple Keys', () => {
        const typedMap = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }],
            ['b', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }],
            ['c', {
                prefix: ['d'],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }]
        ]);
        assertTest(
            str({
                a: {
                    array: null,
                    object: null,
                    types: [
                        'string'
                    ]
                },
                b: {
                    array: null,
                    object: null,
                    types: [
                        'string'
                    ]
                },
                d: {
                    array: null,
                    object: {
                        c: {
                            array: null,
                            object: null,
                            types: [
                                'string'
                            ]
                        }
                    },
                    types: null
                }
            }),
            str(convertTypedMapToTypedJson(typedMap))
        );
    });

    test('Convert Array Type Keys with Single Types', () => {
        const typedMap = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: {
                        array: null,
                        object: null,
                        types: new Set([
                            'string',
                            'number',
                            'boolean',
                            'null'
                        ])
                    },
                    object: null,
                    types: null
                }
            }]
        ]);
        assertTest(
            str({
                a: {
                    array: {
                        array: null,
                        object: null,
                        types: [
                            'string',
                            'number',
                            'boolean',
                            'null'
                        ]
                    },
                    object: null,
                    types: null
                }
            }),
            str(convertTypedMapToTypedJson(typedMap))
        );
    });

    test('Convert Array Type Keys with Array Types', () => {
        const typedMap = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: {
                        array: {
                            array: null,
                            object: null,
                            types: new Set([
                                'string',
                                'number',
                                'boolean',
                                'null'
                            ])
                        },
                        object: null,
                        types: null
                    },
                    object: null,
                    types: null
                }
            }]
        ]);
        assertTest(
            str({
                a: {
                    array: {
                        array: {
                            array: null,
                            object: null,
                            types: [
                                'string',
                                'number',
                                'boolean',
                                'null'
                            ]
                        },
                        object: null,
                        types: null
                    },
                    object: null,
                    types: null
                }
            }),
            str(convertTypedMapToTypedJson(typedMap))
        );
    });

    test('Convert Array Type Keys with Object Types', () => {
        const typedMap = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: {
                        array: null,
                        object: new Map([
                            ['a', {
                                prefix: [],
                                type: {
                                    array: null,
                                    object: null,
                                    types: new Set([
                                        'string',
                                        'number',
                                        'boolean',
                                        'null'
                                    ])
                                }
                            }]
                        ]),
                        types: null
                    },
                    object: null,
                    types: null
                }
            }]
        ]);
        assertTest(
            str({
                a: {
                    array: {
                        array: null,
                        object: {
                            a: {
                                array: null,
                                object: null,
                                types: [
                                    'string',
                                    'number',
                                    'boolean',
                                    'null'
                                ]
                            }
                        },
                        types: null
                    },
                    object: null,
                    types: null
                }
            }),
            str(convertTypedMapToTypedJson(typedMap))
        );
    });

});