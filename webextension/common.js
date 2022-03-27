const suggestWords = (words, greyLetters, yellowLetters, greenLetters, startingWord) => {
  if (greyLetters.size === 0 && Object.keys(yellowLetters).length === 0) return [startingWord]

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
  const allGuesses = guesses.filter(word => isGoodGuess(word, yellowLetters, greenLetters))
  return allGuesses.sort((a, b) => {
    const scoreA = [...a].reduce((sum, letter, idx) => sum += positionalFrequency.get(letter)[idx], 0)
    const scoreB = [...b].reduce((sum, letter, idx) => sum += positionalFrequency.get(letter)[idx], 0)
    return scoreB - scoreA
  })
}

const isGoodGuess = (word, yellowLetters, greenLetters) => {
  const yellowLettersInWord = new Set()
  for (let i = 0; i < word.length; i++) {
    const letter = word[i]
    // If word doesn't have green letter in right place, bad guess
    if (!(greenLetters.every((_, idx) => greenLetters[idx] === '' || word[idx] === greenLetters[idx]))) {
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
