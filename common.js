const startingWord = "sorel"

const suggestWord = (words, greyLetters, yellowLetters, greenLetters) => {
  if (greyLetters.size === 0 && Object.keys(yellowLetters).length === 0) return startingWord

  const guesses = new Array()
  const positionalFrequency = new Map()
  for (let letter of "abcdefghijklmnopqrstuvwxyz") {
    positionalFrequency.set(letter, Array.apply(null, Array(words[0].length)).map(function () { }))
  }
  for (let word of words) {
    if ([...word].some(letter => greyLetters.has(letter))) continue
    guesses.push(word)
    for (let i = 0; i < word.length; i++) {
      const count = positionalFrequency.get(word[i])[i]
      if (count === undefined) {
        positionalFrequency.get(word[i])[i] = 1
      } else {
        positionalFrequency.get(word[i])[i] = count + 1
      }
    }
  }
  const bestGuess = {
    "word": "",
    "score": 0,
  }
  guesses.forEach(word => {
    if (isGoodGuess(word, yellowLetters, greenLetters)) {
      const score = [...word].reduce((sum, letter, idx) => sum += positionalFrequency.get(letter)[idx], 0)
      if (bestGuess["score"] < score) {
        bestGuess["word"] = word
        bestGuess["score"] = score
      }
    }
  })
  return bestGuess["word"]
}

const isGoodGuess = (word, yellowLetters, greenLetters) => {
  const yellowLettersInWord = new Set()
  for (let i = 0; i < word.length; i++) {
    const letter = word[i]
    // If word doesn't have green letter in right place, bad guess
    if (!(greenLetters.every((_, idx) =>  greenLetters[idx] === '' || word[idx] === greenLetters[idx]))) {
      return false
    }
    // If word guesses yellow letter in same place, bad guess
    if (letter in yellowLetters) {
      if (yellowLetters[letter].indexOf(i) !== -1) return false
      yellowLettersInWord.add(letter)
    }
  }
  // If word doesn't use all yellow letters, bad guess
  return Object.keys(yellowLetters).length === yellowLettersInWord.size
}

const gradeWord = (word, target) => {
  let output = ""
  for(let i = 0; i < word.length; i++) {
    if (word[i] === target[i]) output += 'g'
    else if (target.indexOf(word[i]) >= 0) output += 'y'
    else output += 'r'
  }
  return output
}

module.exports = { suggestWord, gradeWord };
