chrome.runtime.onMessage.addListener(
  function (request, _, _) {
    if (request.type === "try") {
      // Delete all the letters
      for (let i = 0; i < request.word.length; i++) {
        document.querySelector('[data-key="←"]').click()
      }
      // Enter each letter on the virtual kb
      [...request.word].forEach (letter => {
        document.querySelector(`[data-key="${letter}"]`).click()
      })
      // Press enter
      document.querySelector('[data-key="↵"]').click()
      // Need to set a small timeout here since the state of the letters
      // isn't updated until the letter flipping animations complete.
      setTimeout(updateExtension, 1800)
    } else if (request.type === "load") {
      updateExtension()
    }
  }
)

const updateExtension = () => {
  // 6 item array of each submitted word (e.g. ["slate", "black", "", "", "", ""])
  let words = [...document.querySelector("#wordle-app-game").querySelector("div").querySelector("div").childNodes].map(e => e.childNodes).map(e => [...e].map(e => e.querySelector("div").innerHTML).join(""))
  // 2D array representing evaluations of each guess (e.g. [["absent", "present", "correct", "correct", "absent"], ["tbd", "tbd", "tbd", "tbd", tbd"], ..., ["empty", "empty", "empty", "empty", "empty"]])
  let evaluations = [...document.querySelector("#wordle-app-game").querySelector("div").querySelector("div").childNodes].map(n => n.childNodes).map(e => [...e].map(e => e.querySelector("div").getAttribute("data-state")))
  // Don't count guess word
  let wordLimit = evaluations.filter(e => e[0] !== "tbd" && e[0] !== "empty").length
  chrome.runtime.sendMessage({ words: words.slice(0, wordLimit), evaluations: evaluations.slice(0, wordLimit), theme: getTheme() })
}

const getTheme = () => {
  return document.body.className
}
