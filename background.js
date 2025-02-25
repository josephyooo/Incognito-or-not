chrome.browserAction.onClicked.addListener(function (tab) {
  // executes function when clicking on extension
  chrome.windows.getAll({ populate: true }, function (windows) {
    for (var i = 0; i < windows.length; i++) {
      if (windows[i].id == tab.windowId) {
        createNewTabsInOppositeMode(windows[i].tabs, tab.incognito);

        chrome.windows.remove(windows[i].id)
        return;
      } 
    }
  })
});

chrome.contextMenus.create({
  // creates context menu option on links
  id: "incognitoornot",
  title: "Open Link in Incognito/Normal Window",
  contexts: ["link"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  // executes function when clicking through context menu on a link
  createNewTabsInOppositeMode([info.linkUrl], tab.incognito);
});

function openTabsInWindow(tabs, windowid, incognito) {
  // creates tabs in window of given mode if window given, else creates tabs in new window
  urls = [];
  tabs.forEach(function getUrls(tab) {
    urls.push(tab.url)
  })

  if (!windowid) {
    chrome.windows.create({ url: urls, incognito: incognito });
    return;
  }

  urls.forEach(function createTab(url) {
    chrome.tabs.create({ windowId: windowid, url: url, active: true });
  })
}

function createNewTabsInOppositeMode(tabs, incognito) {
  // creates tab in opp. mode given array of tabs and initial mode
  // comment this section
  chrome.windows.getAll({ windowTypes: ["normal"] }, function (windows) {
    for (var i = 0; i < windows.length; i++) {
      if (windows[i].incognito != incognito) {
        chrome.windows.update(windows[i].id, { focused: true }, function (focused_window) {
          openTabsInWindow(tabs, focused_window.id, !incognito)
        });
      return;
      }
    }
    // to here to force all conversions in new window
    openTabsInWindow(tabs, false, !incognito);
  });
}
