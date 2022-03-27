function saveOptions() {
    var startWord = document.getElementById('start-word').value;
    chrome.storage.sync.set({
        startWord: startWord,
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        startWord: "salet",
    }, function (items) {
        document.getElementById('start-word').value = items.startWord;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
