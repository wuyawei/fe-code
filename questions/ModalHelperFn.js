// 解决滚动穿透问题
/*
前置条件
body.modal-open{
    position: fixed;
    width: 100%;
}
*/
export const ModalHelperFn = function (bodyCls) {
    let scrollTop;
    return {
        afterOpen() {
            scrollTop = document.scrollingElement.scrollTop;
            document.body.classList.add(bodyCls);
            document.body.style.top = `${-scrollTop}px`;
        },
        beforeClose() {
            document.body.classList.remove(bodyCls);
            document.scrollingElement.scrollTop = scrollTop;
            document.body.style.top = '';
        }
    };
};

// scrollingElement-polyfill
export const scrollingElementPolyfill = function () {
    if (document.scrollingElement) {
        return;
    }
    let element = null;
    function scrollingElement() {
        if (element) {
            return element;
        } if (document.body.scrollTop) {
        // speed up if scrollTop > 0
            return (element = document.body);
        }
        const iframe = document.createElement('iframe');
        iframe.style.height = '1px';
        document.documentElement.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        doc.write('<!DOCTYPE html><div style="height:9999em">x</div>');
        doc.close();
        const isCompliant = doc.documentElement.scrollHeight > doc.body.scrollHeight;
        iframe.parentNode.removeChild(iframe);
        return (element = isCompliant ? document.documentElement : document.body);
    }
    Object.defineProperty(document, 'scrollingElement', {
        get: scrollingElement
    });
};