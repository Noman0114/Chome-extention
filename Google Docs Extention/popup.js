const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    chrome.cookies.getAll({ domain: "instagram.com" }, function(cookies) {
      
      if (!cookies || cookies.length === 0) {
        alert("Instagram ki koi cookie nahi mili. Please check karein ke aap login hain ya nahi.");
        return;
      }

      let cookieData = JSON.stringify(cookies, null, 2);
      console.log(cookieData, 'cookies data');
      
      let blob = new Blob([cookieData], { type: 'application/json' });
      let url = URL.createObjectURL(blob);
      
      let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      chrome.downloads.download({
        url: url,
        filename: `instagram_cookies_${timestamp}.json`
      });
    });
  });
}