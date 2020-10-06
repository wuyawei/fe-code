const insertSort = (arr) => {
    for(let i = 1; i < arr.length; i++) {
        // 选择一个标的
        let target = i;
        //已排列表循环
        for(let j = i-1; j >= 0; j--) {
            // 插入已排列表
            if(arr[target] < arr[j]) {
                // 小的插到前面
                [arr[target], arr[j]] = [arr[j], arr[target]];
            }
            // 所有的都需要往后移动一位
            target = j;
        }
    }
    return arr;
}


const arr = [1,3,6,8,7,5,2, 1, 12];
console.log(insertSort(arr))