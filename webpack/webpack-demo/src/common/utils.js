export const createImg = (src, parent) => {
    const img = document.createElement('img');
    img.src= src;
    img.style.width= '300px';
    parent.appendChild(img);
}