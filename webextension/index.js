chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { type: "load" })
})

const absentLetters = new Set()
const presentLetters = {}
const correctLetters = ['', '', '', '', '']

let suggestion = ""
let suggestionElement = {}
let suggestionIdx = 0
let solved = false
let rowElements = []
let bgColor = "#121213"
let correct = "#618c55"
let absent = "#3a3a3c"
let present = "#b1a04c"
let outline = "#d5d6da"
let suggestLetterColor = "white"
let alreadyGuessed = new Set()

chrome.storage.sync.get({
  startWord: "slate",
}, function (items) {
  startingWord = items.startWord;
});

chrome.runtime.onMessage.addListener(
  function (request, _, _) {
    const buttons = [...document.getElementsByTagName("button")]
    if (!request.theme.includes("dark")) {
      bgColor = "white"
      absent = "#797c7e"
      present = "#c6b466"
      correct = "#79a86b"
      outline = "#d5d6da"
      suggestLetterColor = "black"
      buttons.forEach(e => e.className = "btn btn-secondary")
    } else {
      bgColor = "#121213"
      correct = "#618c55"
      absent = "#3a3a3c"
      present = "#b1a04c"
      outline = "#3a3a3c"
      suggestLetterColor = "white"
      buttons.forEach(e => e.className = "btn btn-dark")
    }
    if (request.theme.includes("colorblind")) {
      correct = "#e5804a"
      present = "#92bef4"
    }

    document.getElementById("board").remove()
    const board = document.createElement("div")
    board.id = "board"
    document.body.prepend(board)

    request.words.forEach ((word, idx) =>
      createWordElement(word, request.evaluations[idx])
    )

    request.words.forEach ((word, i) => {
      alreadyGuessed.add(word)
      word.split('').forEach ((letter, j) => {  
        if (request.evaluations[i][j] === 'absent') {
          absentLetters.add(letter)
        } else if (request.evaluations[i][j] === 'present') {
          let letters = presentLetters[letter] || []
          letters.push(j)
          presentLetters[letter] = letters
        } else {
          correctLetters[j] = letter
        }
      })
    })

    absentLetters.forEach(letter => {
      if (Object.keys(presentLetters).includes(letter) || correctLetters.includes(letter)) {
        absentLetters.delete(letter)
      }
    })

    chrome.storage.sync.get({
      easyMode: true,
    }, function (items) {
      var guesses = suggestWords(wordList(items.easyMode).split(','), absentLetters, presentLetters, correctLetters, startingWord, alreadyGuessed)
      if (guesses.length === 0 && items.easyMode) {
        guesses = suggestWords(wordList(false).split(','), absentLetters, presentLetters, correctLetters, startingWord, alreadyGuessed)
      }
      if (request.words.length >= 6 || correctLetters.every(letter => letter !== '')) {
        document.getElementById("buttons").style.display = 'none'
        solved = true
      } else {
        document.getElementById("buttons").style.display = 'block'
        // TODO: impossible guess?
        createWordSuggestion(guesses[0])
      }
      document.body.style.backgroundColor = bgColor
      const letterElements = [...document.querySelectorAll(".letter")]
      letterElements.forEach(e => {
        e.style.borderColor = outline
      })
      const correctElements = [...document.querySelectorAll(".correct")]
      correctElements.forEach(e => {
        e.style.backgroundColor = correct
        e.style.borderColor = correct
      })
      const presentElements = [...document.querySelectorAll(".present")]
      presentElements.forEach(e => {
        e.style.backgroundColor = present
        e.style.borderColor = present
      })
      const absentElements = [...document.querySelectorAll(".absent")]
      absentElements.forEach(e => {
        e.style.backgroundColor = absent
        e.style.borderColor = absent
      })
    })
  }
)

const createWordElement = (word, evaluations) => {
  const rowElement = document.createElement("div")
  rowElements.push(rowElement)
  rowElement.id = "row"
  word.split('').forEach ((letter, idx) => {
    const letterElement = document.createElement("p")
    if (evaluations[idx] === 'present') {
      letterElement.className = "present"
    } else if (evaluations[idx] === 'correct') {
      letterElement.className = "correct"
    } else {
      letterElement.className = "absent"
    }
    letterElement.className = `${letterElement.className} letter`
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
    letterElement.style.color = suggestLetterColor
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
  chrome.storage.sync.get({
    easyMode: true,
  }, function (items) {
    var guesses = suggestWords(wordList(items.easyMode).split(','), absentLetters, presentLetters, correctLetters, startingWord, alreadyGuessed)
    if (guesses.length === 0 && items.easyMode) {
      guesses = suggestWords(wordList(false).split(','), absentLetters, presentLetters, correctLetters, startingWord, alreadyGuessed)
    }
    suggestionIdx += direction
    if (suggestionIdx < 0) {
      suggestionIdx = guesses.length + suggestionIdx
    }
    if (suggestionIdx >= guesses.length) {
      suggestionIdx = suggestionIdx - guesses.length
    }
    document.getElementById("board").removeChild(suggestionElement)
    // TODO: impossible guess?
    createWordSuggestion(guesses[suggestionIdx] || guesses[0])
  })
}

const tryWord = () => {
  if (solved) return
  suggestionIdx = 0
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { type: "try", word: suggestion })
  })
}

document.getElementById('try-word').addEventListener('click', tryWord)
