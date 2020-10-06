// 选择排序
// 选择一个最小的，按循环放到前面
const selectSort = arr => {
    for(let i = 0; i < arr.length; i++) {
        // i 为最小的数字的下标
        let minIndex = i;
        for(let j = i + 1; j < arr.length; j++) {
            // 找到最小值的下标
            if(arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
    return arr;
}


const arr = [1,3,6,8,7,5,2, 1, 12];
console.log(selectSort(arr))