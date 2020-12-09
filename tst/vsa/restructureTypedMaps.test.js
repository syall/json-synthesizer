const { describe, test, assertTest } = require('../testFramework');
const restructureTypedMaps = require('../../src/vsa/restructureTypedMaps');
const str = require('../../src/util/str');

describe('Tests for restructureTypedMaps', () => {

    test('Restructure with No Changes', () => {
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
        const restructuredMap = restructureTypedMaps(typedMap1, typedMap2);
        assertTest(1, restructuredMap.size);
        assertTest(true, restructuredMap.has('a'));
        const { prefix, type } = restructuredMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('string'));
    });

    test('Restructure by Modifying Prefixes', () => {
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
        const restructuredMap = restructureTypedMaps(typedMap1, typedMap2);
        assertTest(1, restructuredMap.size);
        assertTest(true, restructuredMap.has('a'));
        const { prefix, type } = restructuredMap.get('a');
        assertTest(2, prefix.length);
        assertTest(str(['c', 'b']), str(prefix));
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('string'));
    });

    test('Restructure by Omitting Keys', () => {
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
            }]
        ]);
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
        const restructuredMap = restructureTypedMaps(typedMap1, typedMap2);
        assertTest(1, restructuredMap.size);
        assertTest(true, restructuredMap.has('a'));
        const { prefix, type } = restructuredMap.get('a');
        assertTest(0, prefix.length);
        assertTest(null, type.array);
        assertTest(null, type.object);
        assertTest(1, type.types.size);
        assertTest(true, type.types.has('string'));
    });

    test('Restructure Array Single Types', () => {
        const typedMap1 = new Map([
            ['a', {
                prefix: [],
                type: {
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
                }
            }]
        ]);
        const typedMap2 = new Map([
            ['a', {
                prefix: ['c', 'b'],
                type: {
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
                }
            }]
        ]);
        const restructuredMap = restructureTypedMaps(typedMap1, typedMap2);
        assertTest(1, restructuredMap.size);
        assertTest(true, restructuredMap.has('a'));
        const { prefix, type } = restructuredMap.get('a');
        assertTest(2, prefix.length);
        assertTest(str(['c', 'b']), str(prefix));
        assertTest(null, type.array.array);
        assertTest(null, type.array.object);
        assertTest(2, type.array.types.size);
        assertTest(true, type.array.types.has('string'));
        assertTest(true, type.array.types.has('number'));
        assertTest(null, type.object);
        assertTest(null, type.types);
    });

    test('Restructure Array Array Types', () => {
        const typedMap1 = new Map([
            ['a', {
                prefix: [],
                type: {
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
                }
            }]
        ]);
        const typedMap2 = new Map([
            ['a', {
                prefix: ['c', 'b'],
                type: {
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
                }
            }]
        ]);
        const restructuredMap = restructureTypedMaps(typedMap1, typedMap2);
        assertTest(1, restructuredMap.size);
        assertTest(true, restructuredMap.has('a'));
        const { prefix, type } = restructuredMap.get('a');
        assertTest(2, prefix.length);
        assertTest(str(['c', 'b']), str(prefix));
        assertTest(null, type.array.array.array);
        assertTest(null, type.array.array.object);
        assertTest(1, type.array.array.types.size);
        assertTest(true, type.array.array.types.has('string'));
        assertTest(null, type.array.object);
        assertTest(null, type.array.types);
        assertTest(null, type.object);
        assertTest(null, type.types);
    });

    test('Restructure Array Object Types', () => {
        const typedMap1 = new Map([
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
                                        'string'
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
        const typedMap2 = new Map([
            ['a', {
                prefix: [],
                type: {
                    array: {
                        array: null,
                        object: new Map([
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
                        ]),
                        types: null
                    },
                    object: null,
                    types: null
                }
            }]
        ]);
        const restructuredMap = restructureTypedMaps(typedMap1, typedMap2);
        assertTest(1, restructuredMap.size);
        assertTest(true, restructuredMap.has('a'));
        let value = restructuredMap.get('a');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.object);
        assertTest(null, value.type.types);
        assertTest(null, value.type.array.array);
        assertTest(null, value.type.array.types);
        assertTest(1, value.type.array.object.size);
        assertTest(true, value.type.array.object.has('a'));
        value = value.type.array.object.get('a');
        assertTest(2, value.prefix.length);
        assertTest(str(['c', 'b']), str(value.prefix));
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
    });

    test('Restructure Object Types', () => {
        const typedMap1 = new Map([
            ['b', {
                prefix: [],
                type: {
                    array: null,
                    object: new Map([
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
                    ]),
                    types: null
                }
            }]
        ]);
        const typedMap2 = new Map([
            ['b', {
                prefix: [],
                type: {
                    array: null,
                    object: new Map([
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
                    ]),
                    types: null
                }
            }]
        ]);
        const restructuredMap = restructureTypedMaps(typedMap1, typedMap2);
        assertTest(1, restructuredMap.size);
        assertTest(true, restructuredMap.has('b'));
        let value = restructuredMap.get('b');
        assertTest(0, value.prefix.length);
        assertTest(null, value.type.array);
        assertTest(null, value.type.types);
        assertTest(1, value.type.object.size);
        assertTest(true, value.type.object.has('a'));
        value = value.type.object.get('a');
        assertTest(2, value.prefix.length);
        assertTest(str(['c', 'b']), str(value.prefix));
        assertTest(null, value.type.array);
        assertTest(null, value.type.object);
        assertTest(1, value.type.types.size);
        assertTest(true, value.type.types.has('string'));
    });

    test('Fail to Restructure Missing Keys', () => {
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
        try {
            restructureTypedMaps(typedMap1, typedMap2);
            throw new Error();
        } catch (_) { }
    });

});