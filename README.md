# Wordle Solver

CLI Wordle solver. Outputs a guess based on previous guesses.

## Usage

```bash
❯ node wordle.js <word> <green/grey/yellow letters>
```

| Letter | Meaning       |
| ------ | ------------- |
| g      | green letter  |
| y      | yellow letter |
| r      | grey letter   |

## Example

Target answer: chest

```bash
❯ node wordle.js
tares

❯ node wordle.js tares yrryy
spite

❯ node wordle.js tares yrryy spite yrryy
goest

❯ node wordle.js tares yrryy spite yrryy goest rrggg
blest

❯ node wordle.js tares yrryy spite yrryy goest rrggg blest rrggg
chest
```