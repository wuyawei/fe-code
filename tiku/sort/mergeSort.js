const mergeSort = arr => {
    if(arr.length < 2) {
        return arr;
    }
    const point = Math.floor(arr.length / 2);
    const left = arr.slice(0, point);
    const right = arr.slice(point);
    return merge(mergeSort(left), mergeSort(right));
}

var merge = (left, right) => {
    const tmp = [];
    while(left.length && right.length) {
        if(left[0] < right[0]) {
            tmp.push(left.shift());
        } else {
            tmp.push(right.shift());
        }
    }
    while(left.length) {
        tmp.push(left.shift());
    }
    while(right.length) {
        tmp.push(right.shift());
    }
    return tmp;
}


const arr = [1,3,6,8,7,5,2, 1, 12];
console.log(mergeSort(arr));