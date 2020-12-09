const { describe, test, assertTest } = require('../testFramework');
const { unionTypedMaps, unionTypes } = require('../../src/vsa/unions');

describe('Tests for unionTypedMaps', () => {

    test('Union Empty Typed Maps', () => {
        const typedMap1 = new Map();
        const typedMap2 = new Map();
        const unionedMap = unionTypedMaps(typedMap1, typedMap2);
        assertTest(0, unionedMap.size);
    });

    test('Union Generic and Empty Typed Maps', () => {
        const typedMap1 = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }]
        ]);
        const typedMap2 = new Map();
        const unionedMap = unionTypedMaps(typedMap1, typedMap2);
        assertTest(1, unionedMap.size);
        assertTest(true, unionedMap.has('a'));
        const { prefix, type } = unionedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('string'));
    });

    test('Union Empty and Generic Typed Maps', () => {
        const typedMap1 = new Map();
        const typedMap2 = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }]
        ]);
        const unionedMap = unionTypedMaps(typedMap1, typedMap2);
        assertTest(1, unionedMap.size);
        assertTest(true, unionedMap.has('a'));
        const { prefix, type } = unionedMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('string'));
    });

    test('Union Mutually Exclusive Typed Maps', () => {
        const typedMap1 = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }]
        ]);
        const typedMap2 = new Map([
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
        ]);
        const unionedMap = unionTypedMaps(typedMap1, typedMap2);
        assertTest(2, unionedMap.size);
        assertTest(true, unionedMap.has('a'));
        let value = unionedMap.get('a');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
        assertTest(true, unionedMap.has('b'));
        value = unionedMap.get('b');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
    });

    test('Fail to Union Different Prefixes', () => {
        const typedMap1 = new Map([
            ['a', {
                prefix: ['different1'],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }]
        ]);
        const typedMap2 = new Map([
            ['a', {
                prefix: ['different2'],
                type: {
                    array: null,
                    object: null,
                    types: new Set([
                        'string'
                    ])
                }
            }]
        ]);
        try {
            unionTypedMaps(typedMap1, typedMap2);
            throw new Error();
        } catch (_) { }
    });

});

describe('Tests for unionTypes', () => {

    test('Union Same Single Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array);
        assertTest(null, unionedType.object);
        assertTest(4, unionedType.types.size);
        assertTest(true, unionedType.types.has('string'));
        assertTest(true, unionedType.types.has('number'));
        assertTest(true, unionedType.types.has('boolean'));
        assertTest(true, unionedType.types.has('null'));
    });

    test('Union Partially Exclusive Single Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array);
        assertTest(null, unionedType.object);
        assertTest(3, unionedType.types.size);
        assertTest(true, unionedType.types.has('string'));
        assertTest(true, unionedType.types.has('number'));
        assertTest(true, unionedType.types.has('boolean'));
    });

    test('Union Mutually Exclusive Single Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array);
        assertTest(null, unionedType.object);
        assertTest(2, unionedType.types.size);
        assertTest(true, unionedType.types.has('string'));
        assertTest(true, unionedType.types.has('number'));
    });

    test('Union Same Array Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array.array.array);
        assertTest(null, unionedType.array.array.object);
        assertTest(4, unionedType.array.array.types.size);
        assertTest(true, unionedType.array.array.types.has('string'));
        assertTest(true, unionedType.array.array.types.has('number'));
        assertTest(true, unionedType.array.array.types.has('boolean'));
        assertTest(true, unionedType.array.array.types.has('null'));
        assertTest(null, unionedType.array.object);
        assertTest(null, unionedType.array.types);
        assertTest(null, unionedType.object);
        assertTest(null, unionedType.types);
    });

    test('Union Partially Exclusive Array Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array.array.array);
        assertTest(null, unionedType.array.array.object);
        assertTest(3, unionedType.array.array.types.size);
        assertTest(true, unionedType.array.array.types.has('string'));
        assertTest(true, unionedType.array.array.types.has('number'));
        assertTest(true, unionedType.array.array.types.has('boolean'));
        assertTest(null, unionedType.array.object);
        assertTest(null, unionedType.array.types);
        assertTest(null, unionedType.object);
        assertTest(null, unionedType.types);
    });

    test('Union Mutually Exclusive Array Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array.array.array);
        assertTest(null, unionedType.array.array.object);
        assertTest(2, unionedType.array.array.types.size);
        assertTest(true, unionedType.array.array.types.has('string'));
        assertTest(true, unionedType.array.array.types.has('number'));
        assertTest(null, unionedType.array.object);
        assertTest(null, unionedType.array.types);
        assertTest(null, unionedType.object);
        assertTest(null, unionedType.types);
    });

    test('Union Same Object Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array);
        assertTest(null, unionedType.types);
        assertTest(true, unionedType.object.has('a'));
        let value = unionedType.object.get('a');
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

    test('Union Partially Exclusive Object Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array);
        assertTest(null, unionedType.types);
        assertTest(true, unionedType.object.has('a'));
        let value = unionedType.object.get('a');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.types);
        assertTest(true, value.type.object.has('b'));
        value = value.type.object.get('b');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(3, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
        assertTest(true, value.type.types.has('number'));
        assertTest(true, value.type.types.has('boolean'));
    });

    test('Union Mutually Exclusive Object Types', () => {
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
        const unionedType = unionTypes(type1, type2);
        assertTest(null, unionedType.array);
        assertTest(null, unionedType.types);
        assertTest(true, unionedType.object.has('a'));
        let value = unionedType.object.get('a');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.types);
        assertTest(true, value.type.object.has('b'));
        value = value.type.object.get('b');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(2, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
        assertTest(true, value.type.types.has('number'));
    });

    test('Fail to Union Different Object Prefixes', () => {
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
            unionTypes(type1, type2);
            throw new Error();
        } catch (_) { }
    });

});
