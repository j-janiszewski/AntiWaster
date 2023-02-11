

chrome.storage.local.get(["currentSite", "rules", "sites"], function (data) {
    if (!data.currentSite) {
        chrome.storage.local.set({ "currentSite": JSON.stringify({}) }, function () { })
    }
    if (!data.rules) {
        chrome.storage.local.set({ "rules": JSON.stringify({}) }, function () { })
    }
    if (!data.sites) {
        chrome.storage.local.set({ "sites": JSON.stringify({}) }, function () { })
    }
})





chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.url) {
        calculateTimeSpent(changeInfo.url)
    }
})


chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        calculateTimeSpent(tab.url)
    });
});



function calculateTimeSpent(currentUrl) {
    chrome.storage.local.get(["sites", "currentSite"], function (data) {
        const previourSite = JSON.parse(data.currentSite)
        const currentTime = Date.now()
        const secondsSpent = (currentTime - previourSite["enterTime"]) / 1000
        let url
        try {
            url = (new URL(currentUrl)).hostname
        }
        catch (_) {
            url = currentUrl
        }
        const currentSite = { "url": url, "enterTime": currentTime }
        let storedSites = JSON.parse(data.sites)
        if (previourSite) {
            if (storedSites[previourSite.url]) {
                storedSites[previourSite.url] += secondsSpent
            } else {
                storedSites[previourSite.url] = secondsSpent
            }
        }
        chrome.storage.local.set({ "sites": JSON.stringify(storedSites), "currentSite": JSON.stringify(currentSite) }, function () { })
    })
}