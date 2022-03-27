const defaultStartWord = "slate"

function saveOptions() {
    let startWord = document.getElementById('start-word').value;
    let status = document.getElementById('status');
    if (startWord.length != 5) {
        status.textContent = 'Word must contain 5 letters!';
    } else {
        chrome.storage.sync.set({
            startWord: startWord,
        }, function () {
            status.textContent = 'Options saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 750);
        });
    }
}

function restoreOptions() {
    chrome.storage.sync.get({
        startWord: defaultStartWord,
    }, function (items) {
        document.getElementById('start-word').value = items.startWord;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
