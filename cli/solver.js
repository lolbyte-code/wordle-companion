const common = require("./common")
const words = require("./words")

const wrongLetters = new Set()
const yellowLetters = {}
const greenLetters = ['', '', '', '', '']

const guesses = process.argv.slice(2)
for (let i = 0; i < guesses.length; i += 2) {
  for (let j = 0; j < guesses[0].length; j++) {
    if (guesses[i + 1][j] === 'g') {
      greenLetters[j] = guesses[i][j]
    } else if (guesses[i + 1][j] === 'y') {
      let letters = yellowLetters[guesses[i][j]] || []
      letters.push(j)
      yellowLetters[guesses[i][j]] = letters
    } else {
      wrongLetters.add(guesses[i][j])
    }
  }
}
const guess = common.suggestWord(words.allWords.split(','), wrongLetters, yellowLetters, greenLetters)
if (guess === "") {
  console.error("No possible word!")
} else {
  console.log(guess)
}
