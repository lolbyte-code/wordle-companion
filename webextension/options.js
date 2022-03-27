const defaultStartWord = "slate"
const defaultEasyMode = false

function saveOptions() {
    let startWord = document.getElementById('start-word').value
    let easyMode = document.getElementById('easy-mode').checked
    let status = document.getElementById('status')
    if (startWord.length != 5) {
        status.textContent = 'Word must contain 5 letters!'
    } else {
        chrome.storage.sync.set({
            startWord: startWord,
            easyMode: easyMode,
        }, function () {
            status.textContent = 'Options saved.'
            setTimeout(function () {
                status.textContent = ''
            }, 750)
        })
    }
}

function restoreOptions() {
    chrome.storage.sync.get({
        startWord: defaultStartWord,
        easyMode: defaultEasyMode,
    }, function (items) {
        document.getElementById('start-word').value = items.startWord
        document.getElementById('easy-mode').checked = items.easyMode
    })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
