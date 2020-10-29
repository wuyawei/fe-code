const bubbleSort = (arr) => {
    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr.length - i - 1; j++) {
            if(arr[j] > arr[j+1]) {
                let tmp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = tmp;
            }
        }
    }
    return arr;
}

const bubbleSort1 = (arr) => {
    for(let i = 0; i < arr.length; i++) {
        let finish = true;
        for(let j = 0; j < arr.length - i; j++) {
            if(arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                finish = false;
            }
        }
        if(finish) {
            break;
        }
    }
    return arr;
}

const bubbleSort3 = (arr) => {
    let i = arr.length - 1;
    // 换成while也一样
    for(; i > 0;) {
        let pos = 0;
        for(let j = 0; j < i; j++) {
            if(arr[j] > arr[j+1]) {
                pos = j;
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                finish = false;
            }
        }
        i = pos;
    }
    return arr;
}

const arr = [12, 1,3,6,8,7,5,2, 1];
console.log(bubbleSort(arr));
// console.log(bubbleSort1(arr));
// console.log(bubbleSort3(arr));