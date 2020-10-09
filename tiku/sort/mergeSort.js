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


const mergeSort2 = (arr) => {
    parttion(arr, 0, arr.length-1, []);
    return arr;
}
var parttion = (arr, left, right, tmp) => {
    if(left < right) {
        const point = Math.floor((left+right)/2);
        parttion(arr, left, point, tmp);
        parttion(arr, point+1, right, tmp);
        merge2(arr, left, right, tmp);
    }
    return arr;
}
var merge2 = (arr, left, right, tmp) => {
    const point = Math.floor((left+right)/2);
    let leftIndex = left;
    let rightIndex = point+1;
    let tmpIndex = 0;
    while(leftIndex <= point && rightIndex <= right) {
        if(arr[leftIndex] < arr[rightIndex]) {
            tmp[tmpIndex++] = arr[leftIndex++];
        }else{
            tmp[tmpIndex++] = arr[rightIndex++];
        }
    }
    while(leftIndex <= point) {
        tmp[tmpIndex++] = arr[leftIndex++];
    }
    while(rightIndex <= right) {
        tmp[tmpIndex++] = arr[rightIndex++];
    }
    tmpIndex = 0;
    for(let i = left; i <= right; i++) {
        arr[i] = tmp[tmpIndex++];
    }
}


const arr = [1,99,3,6,8,7,5,2, 1, 12];
// console.log(mergeSort(arr));
console.log(mergeSort2(arr));