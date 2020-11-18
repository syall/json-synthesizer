# Final Project Proposal

Steven Yuan

Professor Zhu

CS515

10/9/2020

## Overview

### Summary

As modern software continues to utilize unstructured data for application program interfaces (APIs) and storage solutions, handling the data in statically-typed languages becomes complex due to inconsistency across input sources. Although programmers are processing data with generic processes, usually custom models, handlers, or serializers have to be developed and maintained for each input source. Using program synthesis, a uniform data structure interface can be synthesized from unstructured input data, JSON, from multiple sources given syntactic input / output examples and mapping rules.

### Keywords

API, NoSQL, Schema, Interface, Data Structure, JSON

## Approach

Given a set of input / output examples and structural mapping rules, a single interface for a data structure could be synthesized with basic functionality.

### Structural Constraints

For our output, the intermediate representation (IR) that is a typed JSON context-free grammar (CFG), primarily featuring:

- Type Annotations
- Union Types

```text
Typed JSON CFG
```

The Typed JSON is used to generate code to backend targets that require static typing such as Java and C.

### Behavioral Constraints

Input / Output Examples are structured with input JSON and output Typed JSON:

- The Input example JSON data is parsed
- The parsed JSON is transformed by the mapping rules based on the source
- The transformed JSON is modified by key / value assignment operations to match the output

```text
Input Output Examples = [
  Input: { Data: JSON, Source: String },
  Output: Typed JSON
]
```

Mapping rules can be provided to specify known conversions within the JSON data and can be used to provide better semantics, reductions, or manual unification across different sources.

```text
Mapping Rules = [
  Mapping: [Initial: Typed JSON, Transformed: Typed JSON],
  Source: String
]
```

### Search Strategy

Using a modified Version Space Algebra (VSA) is preferred as combining programs maps to combining data structures, learned by the input / output examples and mapping rules:

- `learn([input, output]) → vs`: Generate key / value assignment operations to produce the output
- `intersect(vs1, vs2) → vs`: Combine the operations, unioning key / value types when needed
- `pick(vs) → program`: Use the operations to generate a Typed JSON IR schema

## Design

```text
┌──────── Constraints ────────┐
| * Input / Output Examples   |
| * Mapping Rules             |
└──────────────┬──────────────┘
               V
┌──────── Synthesizer ────────┐
| Modified VSA                |
| * learn                     |
| * intersect                 |
| * pick                      |
└──────────────┬──────────────┘
               V
┌──────-─── JSON IR ──────────┐
| Type JSON CFG               |
| * Type Annotations          |
| * Union Types               |
└──────────────┬──────────────┘
               V
┌───────── Interface ─────────┐
| * set                       |
| * get                       |
└─────────────────────────────┘
```

## Timeline

Week # | Description
-------|--------------------------------------
5      | Submit Final Project Proposal
6      | Define Typed JSON Grammar and Formats
7      | Implement JSON to Typed JSON Compiler
8      | Implement Mapping Rules Transformer
9-10   | Implement Modified VSA
11     | Implement Interface Schema Generator
12     | Refactor Code
13-14  | Write Report and Presentation
15     | Submit Project Report
