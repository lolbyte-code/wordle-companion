chrome.runtime.onMessage.addListener(
  function (request, _, _) {
    if (request.type === "try") {
      // Delete all the letters
      for (let i = 0; i < request.word.length; i++) {
        document.querySelector("game-app").shadowRoot.querySelector("game-theme-manager").querySelector("#game").querySelector("game-keyboard").shadowRoot.querySelector("#keyboard").querySelectorAll(".row")[2].querySelectorAll("button")[8].click()
      }
      // Enter each letter on the virtual kb
      [...request.word].forEach (letter => {
        [...document.querySelector("game-app").shadowRoot.querySelector("game-theme-manager").querySelector("#game").querySelector("game-keyboard").shadowRoot.querySelector("#keyboard").querySelectorAll(".row")].flatMap(e => [...e.querySelectorAll("button")]).find(e => e.getAttribute("data-key") === letter).click()
      })
      // Press enter
      document.querySelector("game-app").shadowRoot.querySelector("game-theme-manager").querySelector("#game").querySelector("game-keyboard").shadowRoot.querySelector("#keyboard").querySelectorAll(".row")[2].querySelectorAll("button")[0].click()
      updateExtension()
    } else if (request.type === "load") {
      updateExtension()
    }
  }
)

const updateExtension = () => {
  let words = [...document.querySelector("game-app").shadowRoot.querySelector("game-theme-manager").querySelector("#game").querySelector("#board-container").querySelector("#board").querySelectorAll("game-row")].map(e => e.getAttribute("letters"))
  let evaluations = [...document.querySelector("game-app").shadowRoot.querySelector("game-theme-manager").querySelector("#game").querySelector("#board-container").querySelector("#board").querySelectorAll("game-row")].map(e => [...e.shadowRoot.querySelector(".row").querySelectorAll("game-tile")].map(f => f.getAttribute("evaluation")))
  // Don't count guess word
  let wordLimit = evaluations.filter(e => e[0] !== null).length
  chrome.runtime.sendMessage({ words: words.slice(0, wordLimit), evaluations: evaluations.slice(0, wordLimit), theme: getTheme() })
}

const getTheme = () => {
  return document.body.className
}
