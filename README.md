# Wordle Solver

Various CLI utilities for Wordle.

## Solver

You can indicate previous guesses using the following mapping:

| Letter | Meaning       |
| ------ | ------------- |
| g      | green letter  |
| y      | yellow letter |
| r      | grey letter   |

```bash
❯ node solver.js
sorel

❯ node solver.js sorel yrryr
haets

❯ node solver.js sorel yrryr haets yrgyy
these

❯ node solver.js sorel yrryr haets yrgyy these ygggy
chest
```

## Reverse Solver

Target answer: chest

```bash
❯ node reverse.js chest
sorel
haets
these
chest
```

## Benchmark

```bash
❯ node benchmark.js
Total Guesses: 64713
Total Words: 12972
Average Guesses: 4.988667900092507
```
