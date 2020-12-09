# json-synthesizer

## Overview

Program Synthesizer from JSON data sources that produces Transpilable Typed JSON.

## Usage

Install the module using `npm`:

```shell
npm install json-synthesizer
```

To use the synthesizer in [node](https://nodejs.org/):

```javascript
// Import synthesize function
const synthesize = require('json-synthesizer');

// Define High Level Specification
const specification = {
  inputOutputExamples: [
    {
      source: 'tag',
      input: {
        // Input JSON
      },
      output: {
        // Restructured Transformed Input
      }
    },
    // ...
  ],
  transforms: [
    {
      source: 'tag',
      transform: function customTransform(json) {
        // Transform JSON
        return transformedJson;
      }
    },
    // ...
  ]
};

// Output Synthesized Typed JSON String
console.log(synthesize(specification));
```

## Exports

```javascript
// Default Export
module.exports = synthesize;

// VSA Exports
module.exports.vsa = {
  convertJsonToTypedMap,
  convertTypedMapToTypedJson,
  intersects: {
    intersectTypedMaps,
    intersectTypes
  },
  mapTransformsOnJson,
  restructureTypedMaps,
  unions: {
    unionTypedMaps,
    unionTypes
  }
};

// Util Exports
module.exports.util = {
  isType: {
    isArray,
    isNull,
    isObject,
    singleValue
  },
  str
};
```

## Documentation

The main webpage for json-synthesizer can be found at [here](https://json-synthesizer.syall.work).

- Design Documentation is available [here](https://json-synthesizer.syall.work/DESIGN).
- JSDoc Documentation is available [here](https://json-synthesizer.syall.work/docs).
- GitHub Repository is available [here](https://github.com/syall/json-synthesizer).
- NPM Package is available [here](https://www.npmjs.com/package/json-synthesizer).
