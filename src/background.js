// Store for pinned URLs
let pinnedUrls = [];

// Load pinned URLs from storage when extension starts
browser.storage.local.get('pinnedUrls').then(result => {
    pinnedUrls = result.pinnedUrls || [];
});

// Listen for messages from popup or content scripts
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'getPinnedUrls':
            sendResponse({ pinnedUrls: pinnedUrls });
            break;
        case 'addPin':
            if (!pinnedUrls.includes(request.url)) {
                pinnedUrls.push(request.url);
                browser.storage.local.set({ pinnedUrls });
                sendResponse({ success: true, pinnedUrls: pinnedUrls });
            } else {
                sendResponse({ success: false, message: 'URL already pinned' });
            }
            break;
        case 'removePin':
            pinnedUrls = pinnedUrls.filter(url => url !== request.url);
            browser.storage.local.set({ pinnedUrls });
            sendResponse({ success: true, pinnedUrls: pinnedUrls });
            break;
    }
    return true; // Indicates we will send a response asynchronously
});

// Add context menu item
browser.contextMenus.create({
    id: "pin-link",
    title: "Pin this link",
    contexts: ["link"]
});

// Listen for context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "pin-link") {
        if (!pinnedUrls.includes(info.linkUrl)) {
            pinnedUrls.push(info.linkUrl);
            browser.storage.local.set({ pinnedUrls });
            browser.notifications.create({
                type: 'basic',
                iconUrl: browser.runtime.getURL('icons/icon-48.png'),
                title: 'Link Pinned',
                message: 'The link has been pinned successfully!'
            });
        }
    }
});