/* global chrome*/

// noinspection JSUnresolvedVariable
chrome.runtime.onMessage.addListener(function(request) { // background返回的回调消息
    console.log('request', request)
    const addScript = (link) => {
        const theScript = document.createElement('script');
        theScript.src = link;
        document.documentElement.appendChild(theScript);
    };
    const addStyle = (link) => {
        const d = document.createElement('link');
        d.href = link;
        d.rel="stylesheet";
        document.documentElement.appendChild(d);
    };
    if (request.type === 'fetch-resource') {
        console.log('fetch-resource');
        request.contentType === "stylesheet"
            ? request.links.forEach(addStyle)
            : request.links.forEach(addScript)
    }
});