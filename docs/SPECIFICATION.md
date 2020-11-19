# Specification

## Structure

- Input/Output Examples Array
  - `"source"`: semantic tag to classify inputs
  - `"input"`: input JSON data
  - `"output"`: output JSON data
- Mapping Rules Array
  - `"source"`: semantic tag to classify which inputs to transform
  - `"path"`: pattern of path to find key/value pair
    - Last key is the key to find
    - `'*'`is a wildcard of depth one
    - `'**'` is a wildcard of variable depth
  - `"transform"`: function that transform key/value pair
    - Main purpose is to deduplicate key names
    - `parent`: parent of key/value pair
    - `key`: key of key/value pair
    - `value`: value of key/value pair
