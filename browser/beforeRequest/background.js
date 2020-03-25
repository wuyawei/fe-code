chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        // 需要替换的 url
        return {redirectUrl: chrome.extension.getURL(details.url)};
    },
    {
      urls: ["*://*"],  //你要拦截的url地址
      types: ["script"]       //拦截类型为script，
    },
    ["blocking"] //类型blocking为拦截,
  
  );