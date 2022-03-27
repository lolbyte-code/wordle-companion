chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { type: "load" })
})

const greyLetters = new Set()
const yellowLetters = {}
const greenLetters = ['', '', '', '', '']

let suggestion = ""
let suggestionElement = {}
let suggestionIdx = 0
let solved = false
let rowElements = []
let startingWord = "salet"

chrome.storage.sync.get({
  startWord: "salet",
}, function (items) {
  startingWord = items.startWord;
});

chrome.runtime.onMessage.addListener(
  function (request, _, _) {
    document.getElementById("board").remove()
    const board = document.createElement("div")
    board.id = "board"
    document.body.prepend(board)

    request.words.forEach ((word, idx) =>
      createWordElement(word, request.evaluations[idx])
    )

    request.words.forEach ((word, i) => {
      word.split('').forEach ((letter, j) => {  
        if (request.evaluations[i][j] === 'absent') {
          greyLetters.add(letter)
        } else if (request.evaluations[i][j] === 'present') {
          let letters = yellowLetters[letter] || []
          letters.push(j)
          yellowLetters[letter] = letters
        } else {
          greenLetters[j] = letter
        }
      })
    })

    Object.keys(yellowLetters).forEach(letter => {
      if (greyLetters.has(letter)) greyLetters.delete(letter)
    })

    const guesses = suggestWords(allWords.split(','), greyLetters, yellowLetters, greenLetters, startingWord)
    if (guesses[0] === request.words[request.words.length - 1]) {
      document.getElementById("buttons").style.display = 'none'
      solved = true
    } else {
      document.getElementById("buttons").style.display = 'block'
      // TODO: impossible guess?
      createWordSuggestion(guesses[0])
    }
  }
)

const createWordElement = (word, evaluations) => {
  const rowElement = document.createElement("div")
  rowElements.push(rowElement)
  rowElement.id = "row"
  word.split('').forEach ((letter, idx) => {
    const letterElement = document.createElement("p")
    if (evaluations[idx] === 'present') {
      letterElement.id = "yellow"
    } else if (evaluations[idx] === 'correct') {
      letterElement.id = "green"
    } else {
      letterElement.id = "grey"
    }
    letterElement.className = "letter"
    letterElement.innerHTML = letter.toUpperCase()
    rowElement.appendChild(letterElement)
  })
  document.getElementById("board").appendChild(rowElement)
}

const createWordSuggestion = (word) => {
  suggestion = word
  const rowElement = document.createElement("div")
  suggestionElement = rowElement
  rowElement.id = "row"
  word.split('').forEach (letter => {
    const letterElement = document.createElement("p")
    letterElement.className = "letter"
    letterElement.innerHTML = letter.toUpperCase()
    rowElement.appendChild(letterElement)
  })
  document.getElementById("board").appendChild(rowElement)
}

const prevWord = () => {
  suggestWord(-1)
}

document.getElementById('prev-word').addEventListener('click', prevWord)

const nextWord = () => {
  suggestWord(1)
}

document.getElementById('next-word').addEventListener('click', nextWord)

const suggestWord = (direction) => {
  if (solved) return
  const guesses = suggestWords(allWords.split(','), greyLetters, yellowLetters, greenLetters, new Set())
  suggestionIdx += direction
  if (suggestionIdx < 0) {
    suggestionIdx = guesses.length + suggestionIdx
  }
  if (suggestionIdx >= guesses.length) {
    suggestionIdx = guesses.length - suggestionIdx
  }
  document.getElementById("board").removeChild(suggestionElement)
  // TODO: impossible guess?
  createWordSuggestion(guesses[suggestionIdx] || guesses[0])
}

const tryWord = () => {
  if (solved) return
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "try", word: suggestion })
  })
}

document.getElementById('try-word').addEventListener('click', tryWord)
