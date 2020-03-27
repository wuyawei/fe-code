const downloadQr = () => {
    // 下载跨域问题（同源图片可以直接下载）
    const src = 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png';
    const canvas = document.createElement('canvas');
    const img = document.createElement('img');
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'aaa';
            link.click();
        }, 'image/jpeg');
    };
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = src;
};