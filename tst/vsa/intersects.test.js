const { describe, test, assertTest } = require('../testFramework');
const { intersectTypedMaps, intersectTypes } = require('../../src/vsa/intersects');

describe('Tests for intersectTypedMaps', () => {

    test('Intersect Empty Typed Maps', () => {
        const typedMap1 = new Map();
        const typedMap2 = new Map();
        const intersectedMap = intersectTypedMaps(typedMap1, typedMap2);
        assertTest(0, intersectedMap.size);
    });

    test('Intersect Generic and Empty Typed Maps', () => {
        const typedMap1 = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: [
                        'string'
                    ]
                }
            }]
        ]);
        const typedMap2 = new Map();
        const intersectedMap = intersectTypedMaps(typedMap1, typedMap2);
        assertTest(0, intersectedMap.size);
    });

    test('Intersect Empty and Generic Typed Maps', () => {
        const typedMap1 = new Map();
        const typedMap2 = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: [
                        'string'
                    ]
                }
            }]
        ]);
        const intersectedMap = intersectTypedMaps(typedMap1, typedMap2);
        assertTest(0, intersectedMap.size);
    });

    test('Intersect Mutually Exclusive Typed Maps', () => {
        const typedMap1 = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: [
                        'string'
                    ]
                }
            }]
        ]);
        const typedMap2 = new Map([
            ['b', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: [
                        'string'
                    ]
                }
            }]
        ]);
        const intersectedMap = intersectTypedMaps(typedMap1, typedMap2);
        assertTest(0, intersectedMap.size);
    });

    test('Fail to Intersect Different Prefixes', () => {
        const typedMap1 = new Map([
            ['a', {
                prefix: ['different1'],
                type: {
                    array: null,
                    object: null,
                    types: [
                        'string'
                    ]
                }
            }]
        ]);
        const typedMap2 = new Map([
            ['a', {
                prefix: ['different2'],
                type: {
                    array: null,
                    object: null,
                    types: [
                        'string'
                    ]
                }
            }]
        ]);
        try {
            intersectTypedMaps(typedMap1, typedMap2);
            throw new Error();
        } catch (_) { }
    });

});

describe('Tests for intersectTypes', () => {

    test('Intersect Same Single Types', () => {
        const type1 = {
            array: null,
            object: null,
            types: new Set([
                'string',
                'number',
                'boolean',
                'null'
            ])
        };
        const type2 = {
            array: null,
            object: null,
            types: new Set([
                'string',
                'number',
                'boolean',
                'null'
            ])
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType.array);
        assertTest(null, intersectedType.object);
        assertTest(4, intersectedType.types.size);
        assertTest(true, intersectedType.types.has('string'));
        assertTest(true, intersectedType.types.has('number'));
        assertTest(true, intersectedType.types.has('boolean'));
        assertTest(true, intersectedType.types.has('null'));
    });

    test('Intersect Partially Exclusive Single Types', () => {
        const type1 = {
            array: null,
            object: null,
            types: new Set([
                'string',
                'number'
            ])
        };
        const type2 = {
            array: null,
            object: null,
            types: new Set([
                'string',
                'boolean'
            ])
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType.array);
        assertTest(null, intersectedType.object);
        assertTest(1, intersectedType.types.size);
        assertTest(true, intersectedType.types.has('string'));
    });

    test('Intersect Mutually Exclusive Single Types', () => {
        const type1 = {
            array: null,
            object: null,
            types: new Set([
                'string'
            ])
        };
        const type2 = {
            array: null,
            object: null,
            types: new Set([
                'number'
            ])
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType);
    });

    test('Intersect Same Array Types', () => {
        const type1 = {
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
        };
        const type2 = {
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
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType.array.array.array);
        assertTest(null, intersectedType.array.array.object);
        assertTest(4, intersectedType.array.array.types.size);
        assertTest(true, intersectedType.array.array.types.has('string'));
        assertTest(true, intersectedType.array.array.types.has('number'));
        assertTest(true, intersectedType.array.array.types.has('boolean'));
        assertTest(true, intersectedType.array.array.types.has('null'));
        assertTest(null, intersectedType.array.object);
        assertTest(null, intersectedType.array.types);
        assertTest(null, intersectedType.object);
        assertTest(null, intersectedType.types);
    });

    test('Intersect Partially Exclusive Array Types', () => {
        const type1 = {
            array: {
                array: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string',
                        'number'
                    ])
                },
                object: null,
                types: null
            },
            object: null,
            types: null
        };
        const type2 = {
            array: {
                array: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string',
                        'boolean'
                    ])
                },
                object: null,
                types: null
            },
            object: null,
            types: null
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType.array.array.array);
        assertTest(null, intersectedType.array.array.object);
        assertTest(1, intersectedType.array.array.types.size);
        assertTest(true, intersectedType.array.array.types.has('string'));
        assertTest(null, intersectedType.array.object);
        assertTest(null, intersectedType.array.types);
        assertTest(null, intersectedType.object);
        assertTest(null, intersectedType.types);
    });

    test('Intersect Mutually Exclusive Array Types', () => {
        const type1 = {
            array: {
                array: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                },
                object: null,
                types: null
            },
            object: null,
            types: null
        };
        const type2 = {
            array: {
                array: {
                    array: null,
                    object: null,
                    types: new Set([
                        'number'
                    ])
                },
                object: null,
                types: null
            },
            object: null,
            types: null
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType);
    });

    test('Intersect Same Object Types', () => {
        const type1 = {
            array: null,
            object: new Map([
                ['a', {
                    prefix: [],
                    type: {
                        array: null,
                        object: new Map([
                            ['b', {
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
                    types: null
                }]
            ]),
            types: null
        };
        const type2 = {
            array: null,
            object: new Map([
                ['a', {
                    prefix: [],
                    type: {
                        array: null,
                        object: new Map([
                            ['b', {
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
                    types: null
                }]
            ]),
            types: null
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType.array);
        assertTest(null, intersectedType.types);
        assertTest(true, intersectedType.object.has('a'));
        let value = intersectedType.object.get('a');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.types);
        assertTest(true, value.type.object.has('b'));
        value = value.type.object.get('b');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(4, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
        assertTest(true, value.type.types.has('number'));
        assertTest(true, value.type.types.has('boolean'));
        assertTest(true, value.type.types.has('null'));
    });

    test('Intersect Partially Exclusive Object Types', () => {
        const type1 = {
            array: null,
            object: new Map([
                ['a', {
                    prefix: [],
                    type: {
                        array: null,
                        object: new Map([
                            ['b', {
                                prefix: [],
                                type: {
                                    array: null,
                                    object: null,
                                    types: new Set([
                                        'string',
                                        'number'
                                    ])
                                }
                            }]
                        ]),
                        types: null
                    },
                    types: null
                }]
            ]),
            types: null
        };
        const type2 = {
            array: null,
            object: new Map([
                ['a', {
                    prefix: [],
                    type: {
                        array: null,
                        object: new Map([
                            ['b', {
                                prefix: [],
                                type: {
                                    array: null,
                                    object: null,
                                    types: new Set([
                                        'string',
                                        'boolean'
                                    ])
                                }
                            }]
                        ]),
                        types: null
                    },
                    types: null
                }]
            ]),
            types: null
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType.array);
        assertTest(null, intersectedType.types);
        assertTest(true, intersectedType.object.has('a'));
        let value = intersectedType.object.get('a');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.types);
        assertTest(true, value.type.object.has('b'));
        value = value.type.object.get('b');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
    });

    test('Intersect Mutually Exclusive Object Types', () => {
        const type1 = {
            array: null,
            object: new Map([
                ['a', {
                    prefix: [],
                    type: {
                        array: null,
                        object: new Map([
                            ['b', {
                                prefix: [],
                                type: {
                                    array: null,
                                    object: null,
                                    types: new Set([
                                        'string'
                                    ])
                                }
                            }]
                        ]),
                        types: null
                    },
                    types: null
                }]
            ]),
            types: null
        };
        const type2 = {
            array: null,
            object: new Map([
                ['a', {
                    prefix: [],
                    type: {
                        array: null,
                        object: new Map([
                            ['b', {
                                prefix: [],
                                type: {
                                    array: null,
                                    object: null,
                                    types: new Set([
                                        'number'
                                    ])
                                }
                            }]
                        ]),
                        types: null
                    },
                    types: null
                }]
            ]),
            types: null
        };
        const intersectedType = intersectTypes(type1, type2);
        assertTest(null, intersectedType);
    });

    test('Fail to Intersect Different Object Prefixes', () => {
        const type1 = {
            array: null,
            object: new Map([
                ['a', {
                    prefix: [],
                    type: {
                        array: null,
                        object: new Map([
                            ['b', {
                                prefix: ['different1'],
                                type: {
                                    array: null,
                                    object: null,
                                    types: new Set([
                                        'string'
                                    ])
                                }
                            }]
                        ]),
                        types: null
                    },
                    types: null
                }]
            ]),
            types: null
        };
        const type2 = {
            array: null,
            object: new Map([
                ['a', {
                    prefix: [],
                    type: {
                        array: null,
                        object: new Map([
                            ['b', {
                                prefix: ['different2'],
                                type: {
                                    array: null,
                                    object: null,
                                    types: new Set([
                                        'string'
                                    ])
                                }
                            }]
                        ]),
                        types: null
                    },
                    types: null
                }]
            ]),
            types: null
        };
        try {
            intersectTypes(type1, type2);
            throw new Error();
        } catch (_) { }
    });

});