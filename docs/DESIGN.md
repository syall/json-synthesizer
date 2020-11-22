# Design

## Problem

Modern technologies have continued to use unstructured data for a wide variety of cases (APIs, storage, databases, etc.). However, handling data from different sources in a single application is tedious and error prone although the processes on the data is generic. For each input source, a custom handler has to manually be defined which is both tedious and error-prone. json-synthesizer was designed to synthesize a generic typed interface using a modified version space algebra given input/output examples and transforms.

## Solution

json-synthesizer is a program synthesizer that takes as input a specification which contains input/output examples and transforms. A modified version space algebra is used by defining learn, union, and intersect operations on typed maps, representing data structures. Each input/output example is processed by intersecting an input typed map and output typed map to produce an intersected typed map. Then, each of the intersected typed maps are unioned with each other to produce a single typed map which represents the final data structure. The final typed map is converted into typed JSON, a synthesized generic typed interface.

json-synthesizer is implemented in JavaScript in the Node.js runtime, which can be imported from the `synthesize` module of the source code.

### Architecture

![json-synthesizer Architecture](./img/WORKFLOW.png "json-synthesizer Architecture")

### Process

The design of json-synthesizer is a pipeline, processing the input specification in various steps.

- First, a specification for the synthesizer is defined with input/output examples and transforms.
- Second, the input/output examples are each mapped to typed maps:
  - The input example is mapped to transforms based on source tags.
  - The transformed input example is converted to a typed map.
  - The output example is converted to a typed map
  - The input typed map and output typed map are intersected
- Third, the typed maps are reduced by union until there is a single typed map
- Finally, the final typed map is converted to typed JSON

The pipeline is abstracted from the user by only exposing the `synthesize` function.

### Specification

The specification for the synthesis is comprised of two parts: a list of input/output examples and a list of transforms.

```javascript
const specification = {
  inputOutputExamples: [
   {
     source: ['tag 1', /* ... */, 'tag n'],
     input: {
       // Input JSON from Data Source (API, database, etc.)
     },
     output: {
       // Desired Output JSON from Transformed Input JSON
     }
   }
   // ... Multiple Input/Output Examples
  ],
  transforms: [
    {
      source: 'tag',
      // transform :: JSON -> JSON
      transform: json => { /* return Transformed JSON */ }
    },
    // ... Multipled Transforms
  ]
};
```

#### Input/Output Examples

Input/Output examples are defined in the specification as a list of objects which contain a `source`, `input`, and `output`:

```javascript
const inputOutputExamples = [
  {
    source: ['tag 1', /* ... */, 'tag n'],
    input: {
      // Input JSON from Data Source (API, database, etc.)
    },
    output: {
      // Desired Output JSON from Transformed Input JSON
    }
  },
  // ... Multiple Input/Output Examples
];
```

The `source` is a list of semantic tags (strings) to classify inputs, which are then used to identify which transforms should be applied. It should be noted that the order of the tags will not affect the order of the transforms, but instead the order the transforms are defined.

The `input` is JSON data which can be acquired from any data source. The input is not allowed to have duplicate keys, defined as keys with identical names can be reached with the dot `.` operator from the root object, because there would be collisions when converting the input to a typed map. However, if data from an input source does contain duplicate keys, the data can be cleaned by applying transforms that either rename the conflicting keys or remove the key/value pair.

The `output` is the desired structure and types of the JSON data. Any keys and types used later in the synthesis will be limited here regardless of the input data. The output assumes keys and values not from the input but the transformed input, so it is important to keep track of each applied transform's changes to the keys and values.

#### Transforms

Transforms are defined in the specification as a list of objects which contain a `source` and `transform`:

```javascript
const transforms = [
  {
    source: 'tag',
    // transform :: JSON -> JSON
    transform: json => { /* return Transformed JSON */ }
  },
  // ... Multipled Transforms
];
```

The `source` is a semantic tag (string) that is associated with input/output examples. Only input/output examples that include the tag in its source will have the transform applied.

The `transform` is a function that takes in JSON as an argument and returns JSON (`transform :: JSON -> JSON`). This is important as multiple transforms can be applied to a single input, so without the type signature, the transform pipeline may cause an error. The order of transforms applied to inputs is the order defined in the list, so managing the order of the transforms is important. Transforms can range in functionality, from simply renaming keys (example in `tst/unit.test.js`) to unmarshalling a schema (example in `tst/dynamo.test.js`). The transform functions correctness and safety is wholly dependent on the user, as there is no template for the possible range of transforms.

### Version Space Algebra Synthesis

json-synthesizer uses a modified version space algebra, a way in which sets of programs can be represented as nodes. By applying operations on these sets, a program can be synthesized that can satisfy the input specification. json-synthesizer uses typed maps as nodes with the learn, union, and intersect operations defined, with the synthesized typed JSON converted from the final typed map.

#### Type

Each type represented by an object which contains `array`, `object` and `types`:

```javascript
const type = {
  array: type /* or null */,
  object: new Map([/* key/value pairs */]) /* or null */,
  types: new Set([/* single value types*/]) /* or null */
};
```

Every key in a typed map has an associated type which represents the union of types that the key could be. If the entry in type is null, it means that the key cannot be that type; on the other hand, the key could be one of the non-null entries.

For example, if `entry` had a type:

```javascript
const example = {
  entry: {
    // An array
    array: {
      // Not of arrays
      array: null,
      // Not of objects
      object: null,
      // Of numbers and booleans
      types: new Set(['number', 'boolean'])
    },
    // Not an object
    object: new Map([
      [
        'sample',
        {
          prefix: [],
          type: {
            // Not an array
            array: null,
            // Not an object
            object: null,
            // null
            types: new Set(['null']) 
          }
        }
      ]
    ]),
    // A string
    types: new Set(['string'])
  }
};
```

So, `entry` could:

- Be an array that contains numbers and booleans
- Be an object with a key of `sample` that can be null
- Be a string

The `array` entry is a recursion of type which defines the types of the elements which could be an array, including recursive definitions for arrays of arrays and arrays of objects.

The `object` entry is a typed map which defines the entries of the object at that level, each of which has a type.

The `types` entry is a javascript Set of single value types which have no recursive types. The single value types are string, number, boolean, and null.

#### Typed Map

Each typed map is represented by an javascript Map which with entries of keys to an object with `prefix` and `type`:

```javascript
const typedMap = new Map([
  // Key/Value Entry
  [
    // Key in object
    'key',
    // Value in object
    {
      // Dot `.` path
      prefix: [],
      // Type of Key
      type: {
        array: null,
        object: null,
        types: null
      }
    }
  ],
  // ... Other keys in the object
  ['key1', { /* prefix, type */ }]
]);
```

The key of an entry is represented as a key in the typed map. This means that there cannot be multiple keys of the same name in an object. json-synthesizer is strict with its duplicate key restriction by duplication defined by dot `.` paths in order to better fit the operations in the version space algebra. Particularly, only keys that can be concrete values (arrays, single value types) are kept with their prefix in the map. Although one could construct a typed map to have a recursive structure like JSON, it forfeit any benefits to using a map.

The value of an entry contains a prefix and type. The prefix is the dot `.` path keys from the root object in a list. This is opposed to having the recursive structure of JSON which increases the complexity of traversal. The type is the type of the value, which is covered in the [Type section](#type).

#### Typed JSON

Typed JSON is the product of converting typed maps into JSON. By recursing through the entries of a typed map, keys can be built using the prefix path, then converting the type of the values into JSON. Each type is converted: the array type converted by recursion if not null, the object typed map converted by converting typed maps into JSON, and the types converted from a Set to a list.

```javascript
const convertedTypedMap = {
  entry: {
    array: convertedType /* or null */,
    object: convertedTypedMap /* or null */,
    types: Array.from(types) /* or null */
  }
  // ... More entries in object
};
```

The synthesized program is Typed JSON as a serialized representation of a typed map, retaining all of the structure and type information for each key from the value containing the prefix path and type.

```text
Typed JSON EBNF Grammar:

<typed-json>  ::= <object>
<object>      ::= '{' <key-list>? '}'
<key-list>    ::= <member> (',' <member>)*
<member>      ::= <key> ':' <type> 
<key>         ::= // See JSON specification for string: https://www.json.org
<type>        ::= '{' <array-type> ',' <object-type> ',' <types-type> '}'
<array-type>  ::= '"array"' ':' (<type> | <null>)
<object-type> ::= '"object"' ':' (<object> | <null>)
<types-type>  ::= '"types"' ':' (<types-list> | <null>)
<types-list>  ::= '[' <single-list>? ']'
<single-list> ::= <single-type> (',' <single-type>)*
<single-type> ::= '"string"' | '"number"' | '"boolean"' | '"null"'
<null>        ::= 'null'
```

#### Learn

The modified version space algebra has an analogous learn operation to produce version spaces from the input/output examples:

```text
Version Space Algebra Learn Operation:
learn <input, output> -> version space

Analogous json-synthesizer Learn Operation:
restructure <input JSON, output JSON> -> typed map
```

The learn operation for json-synthesizer decides the key/value types and structure based on the input JSON and output JSON. Since json-synthesizer deals with JSON data structures, learning an example is not about functional requirements but structural constraints, thus the learn operation is akin to restructuring. To prepare for restructuring, the input JSON has the applicable transforms applied. Then, both the input JSON and output JSON are converted to typed maps. Learning for the structure of the output occurs by changing the prefix paths for keys in the input typed map based on the output typed map; also, the learned typed map only includes keys from the input typed map if the keys exist in the output typed map. Learning for the key/value types is done by intersection of the input and output typed maps. So, for each input/output example, a single typed map is produced by constraining the input JSON with structural and type constraints of the output JSON.

#### Intersect

The modified version space algebra has an analogous intersection operation for version spaces:

```text
Version Space Algebra Intersect Operation:
version space 1 ∩ version space 2 -> version space

Analogous json-synthesizer Intersect Operation:
typed map 1 ∩ typed map 2 -> typed map
```

The intersect operation for json-synthesizer intersects both keys and types, producing a typed map with the intersected keys and types. In traditional version space algebra, the intersect operation intersects two sets of programs; however, json-synthesizer intersection focuses on the structural and type constraints. First, only keys that exist in both input typed maps will be included in the intersected typed map; however, if the duplicate key restriction is violated, the intersection will fail due to no resolution process. For each of the keys included, the types of the values will be recursively intersected by checking the array, object, and single value types to produce a minimal type. So, for the input typed maps, a single typed map is produced by intersecting keys and types.

#### Union

The modified version space algebra has an analogous union operation for version spaces:

```text
Version Space Algebra Union Operation:
version space 1 ∪ version space 2 -> version space

Analogous json-synthesizer Union Operation:
typed map 1 ∪ typed map 2 -> typed map
```

The union operation for json-synthesizer unions both keys and types, producing another typed map with the unioned keys and types. In traditional version space algebra, the union operation unions two sets of programs; however, json-synthesizer union focuses on the structural and type constraints. First, any keys that exclusively exist in either of the input typed maps will be included in the produced typed map. Then, keys that exist in both input typed maps will be unioned in the produced typed map; however, if the duplicate key restriction is violated, the union will fail due to no resolution process. For each of the keys that exist in both input typed maps, the types of the values will be recursively unioned by checking the array, object, and single value types to produce a maximal type. So, for the input typed maps, a single typed map is produced by unioning keys and types.

### Limitations

json-synthesizer has two main limitations when considering synthesis: duplicate key restriction and loss of semantic keys.

#### Duplicate Key Restriction

Because typed maps are used, any key that can have a value (arrays, single value types) cannot be duplicate in an object by dot `.` path. Input source JSON which have nested keys with duplicates have to be handled by transforms, otherwise will be incompatible with json-synthesizer. Otherwise, for the modified version space algebra operations, there is no resolution process to determine which prefix of the duplicate keys to use.

#### Semantic Keys

For some predefined schemas, the keys may have semantic meaning. However, json-synthesizer treats any key in a dot `.` path as simply a label for structure with no semantic meaning. For example, DynamoDB wraps each value with [Data Types](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes), including types such as Sets. Even with transforms required for DynamoDB to resolve the duplicate key restriction (example transform can be found in `tst/dynamo.test.js`), json-synthesizer can only handle the data types defined in the [JSON specification](https://www.json.org/).

## Proposal

The initial project proposal can be found in [PROPOSAL.md](./PROPOSAL.md).

Comments from Professor He Zhu: "This is great. You may need to pay attention to designing and identifying useful library functions in your grammar."

For typed JSON, json-synthesizer ended up with a structural grammar rather than a grammar with library functions so the comments were not relevant to the domain.

## Reflection

json-synthesizer was created as a final project for Rutgers University CS16:198:515 Programming Languages and Compilers I in Fall 2020 with the topic of Program Synthesis in Fall 2020.

I had taken the course expecting a traditional class about compilers, but instead I was greeted with program synthesis. To an extent I was disappointed, but on the other hand the topic became interesting to me albeit difficult to understand.

The idea of transpiling data structures from one schema had been a project idea of mine for a long time, but I never knew how to approach the problem. My original idea was to simply write out a specification, parse JSON, and write custom handlers, but even that was too difficult for me.

Then during one lecture on representation-based search, the professor talked about version space algebra, operating on sets of programs that fit a specification until a final program was picked. I thought that the recursive nature of version space algebra could be a perfect fit for putting smaller JSON components together until a final product represented the JSON data structure desired.

However, during implementation I found this not only complex but also without much technical benefit. The search would be exponential and confusing, particularly with duplicate keys. A program could be synthesized with duplicate keys at different levels which would fit the output examples, but if keys had the same or encapsulated types, which program would be the best fit? At first I considered having the most minimal type, but if it was wrong then there would be loss of data.

Either way, duplicate key resolution was complex due to unreliable heuristics, so I opted to apply a restriction to not have them. With that restriction, a new possibility emerged: if all keys are unique, then that means the components did not have to be a recursive structure, but could be represented with maps. This reduced some of the complexity (as it is still possible to have recursive types), but also greatly improved runtime. Also, the memory benefits of not having to store keys that only held structural value (keys with object type only rebuilt with prefix paths) was tremendous.

The actual implementation of operating on JSON, typed maps, types, and typed JSON proved to be technically complex not due to lines of code, but because of the recursive nature of these objects. Just wrapping my head around the traversals took a lot of time, but the result of enumerating all the cases was rewarding.

So, although json-synthesizer became different than what I had originally entailed for a project, I believe that what it is now is more versatile and efficient due to the modified version space algebra and duplicate key restriction. 
