chrome.webRequest.onBeforeRequest.addListener(

    function(details) {
      if (details.url.indexOf('y_id') === -1) return;
      const detailsUrl = details.url.split('?');
      const params = detailsUrl[1].split('&');
      const obj = {};
      params.forEach(item => {
            obj[item.split('=')[0]] = item.split('=')[1]
      })
      const url = `${detailsUrl[0]}?callback=${obj.callback}&ad_preview=1&ad_coor=${obj.w_id}&ad_id=${obj.y_id}&_=${obj._}`;
      console.log(123456, url);
      return {redirectUrl: chrome.extension.getURL(url)};
  
    },
  
    {
  
      urls: ["*://cmsapp.koolearn.com/advertisement_list.php*"],  //你要拦截的url地址
  
      types: ["script"]       //拦截类型为script，
  
    },
  
    ["blocking"] //类型blocking为拦截,
  
  );