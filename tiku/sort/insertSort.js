const insertSort = (arr) => {
    for(let i = 1; i < arr.length; i++) {
        // 选择一个标的
        let target = i;
        //已排列表循环
        // 一轮循环以后，说明 i（包括 i）之前的已经排序好了
        for(let j = i-1; j >= 0; j--) {
            // 插入已排列表
            if(arr[target] < arr[j]) {
                // 小的插到前面
                [arr[target], arr[j]] = [arr[j], arr[target]];
                // 交换后，原来的 target 的下标，变成了j
                // 起始下标是 i，第一次交换，是将 i-1 移动到了 i
                // target 变为了 i - 1，即 j
                // 所以每次 arr[target] 是同一个值依次和前面已排序的值做比较
                // 找到最终位置
                target = j;
            } else {
                // 如果已排列表中，最大的一个都比 target 小，那本次循环可以跳过
                break;
            }
        }
    }
    return arr;
}


const arr = [1,3,6,8,7,5,2, 1, 12];
console.log(insertSort(arr))