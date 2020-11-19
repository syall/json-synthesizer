# Synthesis

## Version Space Algebra

- Union
- Intersect

## `synthesize` function in `src/synthesize.js`:

- `spec`: Specification
- `typedMaps`: Convert Input/Output Examples into Typed Maps
  - `mappedJson`: map transform functions on input JSON
  - `typedMapInput`: convert mapped JSON to Typed Map
  - `typedMapOutput`: convert output JSON to Typed Map
  - `intersectedTypedMap`: intersect Typed Maps of input and output
- `unionTypedMap`: reduce all Typed Maps into a Single Typed Map
- `unionTypedJson`: convert Typed Map to Typed JSON
