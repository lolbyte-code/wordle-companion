const suggestWords = (words, absentLetters, presentLetters, correctLetters, startingWord) => {
  if (absentLetters.size === 0 && Object.keys(presentLetters).length === 0) return [startingWord]

  const guesses = new Array()
  const positionalFrequency = new Map()
  for (let letter of "abcdefghijklmnopqrstuvwxyz") {
    positionalFrequency.set(letter, Array.apply(null, Array(words[0].length)).map(function () { }))
  }
  for (let word of words) {
    if ([...word].some(letter => absentLetters.has(letter))) continue
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
  const allGuesses = guesses.filter(word => isGoodGuess(word, presentLetters, correctLetters))
  return allGuesses.sort((a, b) => {
    const scoreA = [...a].reduce((sum, letter, idx) => sum += positionalFrequency.get(letter)[idx], 0)
    const scoreB = [...b].reduce((sum, letter, idx) => sum += positionalFrequency.get(letter)[idx], 0)
    return scoreB - scoreA
  })
}

const isGoodGuess = (word, presentLetters, correctLetters) => {
  const presentLettersInWord = new Set()
  for (let i = 0; i < word.length; i++) {
    const letter = word[i]
    // If word doesn't have correct letter in right place, bad guess
    if (!(correctLetters.every((_, idx) => correctLetters[idx] === '' || word[idx] === correctLetters[idx]))) {
      return false
    }
    // If word guesses present letter in same place, bad guess
    if (letter in presentLetters) {
      if (presentLetters[letter].indexOf(i) !== -1) return false
      presentLettersInWord.add(letter)
    }
  }
  // If word doesn't use all present letters, bad guess
  return Object.keys(presentLetters).length === presentLettersInWord.size
}
