const common = require("./common")
const words = require("./words")

function main(target) {
  const wrongLetters = new Set()
  const yellowLetters = {}
  const greenLetters = ['', '', '', '', '']

  let guesses = []
  let answerFound = false
  let impossible = false
  let attempts = 0
  while (!answerFound) {
    const guess = common.suggestWord(words.allWords.split(','), wrongLetters, yellowLetters, greenLetters)
    attempts++
    if (guess === "") {
      impossible = true
      break
    }
    if (guess === target) answerFound = true
    const grade = common.gradeWord(guess, target)
    guesses.push([guess, grade])
    for (let i = 0; i < guesses.length; i++) {
      for (let j = 0; j < guesses[0][0].length; j++) {
        if (guesses[i][1][j] === 'g') {
          greenLetters[j] = guesses[i][0][j]
        } else if (guesses[i][1][j] === 'y') {
          let letters = yellowLetters[guesses[i][0][j]] || []
          letters.push(j)
          yellowLetters[guesses[i][0][j]] = letters
        } else {
          wrongLetters.add(guesses[i][0][j])
        }
      }
    }
  }
  if (impossible) return -1
  return attempts
}

let totalGuesses = 0
let wordCount = 0
words.allWords.split(',').forEach(word => {
  let guesses = main(word)
  if (guesses > -1) {
    totalGuesses += guesses
    wordCount++
  } else {
    console.error("Invalid word!")
  }
})
console.log(`Total Guesses: ${totalGuesses}`)
console.log(`Total Words: ${wordCount}`)
console.log(`Average Guesses: ${totalGuesses / wordCount}`)
