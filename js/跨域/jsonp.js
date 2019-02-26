/**
 * Created by wyw on 2019/1/26.
 */
const jsonp = function ({url, params, callback}) {
    let script = document.createElement('script');
    return new Promise((resolve, reject) => {
        window[callback] = function (data) {
            resolve(data);
            document.body.removeChild(script);
        };
        params = {...params, callback};
        let arrs = [];
        for (let key in params) {
            arrs.push(`${key}=${params[key]}`);
        }
        script.src = `${url}?${arrs.join('&')}`;
        document.body.appendChild(script);
    });
};

if (typeof module !== 'undefined' && !module.nodeType && module.exports) {
    module.exports = jsonp;
}