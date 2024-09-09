// Retrieve DOM elements
const urlInput = document.getElementById('urlInput');
const pinButton = document.getElementById('pinButton');
const pinnedList = document.getElementById('pinnedList');

// Function to safely create and append elements
function createAndAppendElement(parent, tag, textContent, attributes = {}) {
    const element = document.createElement(tag);
    element.textContent = textContent;
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    parent.appendChild(element);
    return element;
}

// Function to add a new pinned URL
function addPinnedUrl(url) {
    browser.storage.local.get('pinnedUrls').then((result) => {
        let pinnedUrls = result.pinnedUrls || [];
        if (!pinnedUrls.includes(url)) {
            pinnedUrls.push(url);
            browser.storage.local.set({ pinnedUrls }).then(() => {
                displayPinnedUrls();
                urlInput.value = '';
            });
        } else {
            alert('This URL is already pinned!');
        }
    });
}

// Function to display pinned URLs
function displayPinnedUrls() {
    browser.storage.local.get('pinnedUrls').then((result) => {
        let pinnedUrls = result.pinnedUrls || [];
        pinnedList.innerHTML = ''; // Clear the list
        pinnedUrls.forEach((url) => {
            const listItem = createAndAppendElement(pinnedList, 'div', '', { class: 'pinned-item' });
            const link = createAndAppendElement(listItem, 'a', url, { href: url, target: '_blank' });
            const removeBtn = createAndAppendElement(listItem, 'button', 'Remove', { class: 'remove-btn', 'data-url': url });
        });
        addRemoveListeners();
    });
}

// Function to remove a pinned URL
function removePinnedUrl(url) {
    browser.storage.local.get('pinnedUrls').then((result) => {
        let pinnedUrls = result.pinnedUrls || [];
        pinnedUrls = pinnedUrls.filter(pinnedUrl => pinnedUrl !== url);
        browser.storage.local.set({ pinnedUrls }).then(() => {
            displayPinnedUrls();
        });
    });
}

// Add event listener for pin button
pinButton.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
        addPinnedUrl(url);
    }
});

// Add event listeners for remove buttons
function addRemoveListeners() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.target.getAttribute('data-url');
            removePinnedUrl(url);
        });
    });
}

// Display pinned URLs when popup opens
displayPinnedUrls();