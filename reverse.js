const common = require("./common")
const words = require("./words")

function main(target) {
  const green = "\x1b[42m\x1b[37m\x1b[1m"
  const yellow = "\x1b[43m\x1b[37m\x1b[1m"
  const grey = "\x1b[47m\x1b[37m\x1b[1m"
  const reset = "\x1b[0m"
  const wrongLetters = new Set()
  const yellowLetters = {}
  const greenLetters = ['', '', '', '', '']

  let guesses = []
  let answerFound = false
  let impossible = false
  while (!answerFound) {
    const guess = common.suggestWord(words.allWords.split(','), wrongLetters, yellowLetters, greenLetters)
    if (guess === "") {
      impossible = true
      break
    }
    if (guess === target) answerFound = true
    const grade = common.gradeWord(guess, target)
    guesses.push([guess, grade])
    for (let i = 0; i < guesses.length; i++) {
      let output = ""
      for (let j = 0; j < guesses[0][0].length; j++) {
        if (guesses[i][1][j] === 'g') {
          greenLetters[j] = guesses[i][0][j]
          output += `${green}${guesses[i][0][j]}`
        } else if (guesses[i][1][j] === 'y') {
          let letters = yellowLetters[guesses[i][0][j]] || []
          letters.push(j)
          yellowLetters[guesses[i][0][j]] = letters
          output += `${yellow}${guesses[i][0][j]}`
        } else {
          wrongLetters.add(guesses[i][0][j])
          output += `${grey}${guesses[i][0][j]}`
        }
      }
      if (answerFound) console.log(`${output}${reset}`)
    }
  }
  if (impossible) console.error("Not a valid word!")
}

const args = process.argv.slice(2)
if (args[0] === undefined) {
  console.error("No word provided!")
} else {
  main(args[0])
}
