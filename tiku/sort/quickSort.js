const quickSort = arr => {
    if (arr.length <= 1) return arr;
　　var targetIndex = Math.floor(arr.length / 2);
　　var target = arr.splice(targetIndex, 1)[0];
    const left = [];
    const right = [];
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] < target) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return quickSort(left).concat([target], quickSort(right));
}


const quickSort2 = (arr) => {
    quick(arr, 0, arr.length-1);
    return arr;
}
var quick = (arr, left, right) => {
    let index;
    if(left < right) {
        index = partition(arr, left, right);
        console.log("quick -> index", left,  index, right)
        if(left < index - 1) {
            quick(arr, left, index - 1);
        }
        if(index < right) {
            quick(arr, index, right);
        }
    }
}
var partition = (arr, left, right) => {
　　var targetIndex = Math.floor((right + left)/2);
  console.log("partition -> targetIndex", targetIndex);
　　var target = arr[targetIndex] // 不改变原数组，仅取值

    while(left <= right) {
        while(arr[left] < target) {
            left++;
        }
        while(arr[right] > target) {
            right--;
        }
        if(left <= right) {
            swap(arr, left, right);
            left++;
            right--;
        }
    }

    return left;
}

// 交换
var swap = (arr, i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

const arr = [1,2,3,4];
// console.log(quickSort(arr));
console.log(quickSort2(arr));