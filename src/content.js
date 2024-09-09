// Listen for messages from the background script
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageUrl') {
        sendResponse({ url: window.location.href });
    }
});

// Add a small pin button next to each link on the page
function addPinButtons() {
    const links = document.getElementsByTagName('a');
    for (let link of links) {
        if (!link.querySelector('.starry-night-pin-button')) {
            const pinButton = document.createElement('span');
            pinButton.className = 'starry-night-pin-button';
            pinButton.innerHTML = '📌';
            pinButton.style.cursor = 'pointer';
            pinButton.style.marginLeft = '5px';
            pinButton.title = 'Pin this link';
            pinButton.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                browser.runtime.sendMessage({
                    action: 'addPin',
                    url: link.href
                }).then(response => {
                    if (response.success) {
                        pinButton.style.color = 'gold';
                    }
                });
            };
            link.parentNode.insertBefore(pinButton, link.nextSibling);
        }
    }
}

// Run addPinButtons when the page loads and whenever it changes
addPinButtons();
new MutationObserver(addPinButtons).observe(document.body, { childList: true, subtree: true });