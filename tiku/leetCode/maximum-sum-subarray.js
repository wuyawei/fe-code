/* 
求解连续最大子序列和
Input: [-2,1,-3,4,-1,2,1,-5,4],
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6. 
*/

const maximumSum = (arr) => {
    let maximumSumArr = [];
    let max = -Number.MAX_VALUE;
    for(let i = 0; i < arr.length; i++) {
        for(let j = i+1; j < arr.length; j++) {
            const _arr = arr.slice(i, j+1);
            const sum= _arr.reduce((pre, cur) => pre + cur);
            if(sum > max) {
                maximumSumArr = _arr;
                max = sum;
            }
        }
    }
    console.log("maximumSum -> maximumSumArr", max)
    return max;
}
maximumSum([-2,1,-3,4,-1,2,1,-5,4])

const maximumSum2 = (arr) => {
    let maximumSumArr = [];
    let max = -Number.MAX_VALUE;
    for(let i = 0; i < arr.length; i++) {
        let sum = 0;
        let sumArr = [];
        for(let j = i+1; j < arr.length; j++) { 
            sum += arr[j];
            sumArr.push(arr[j]);
            if (sum > max) {
                max = sum;
                maximumSumArr = [...sumArr];
            }
        }
    } 
    console.log("max", max, maximumSumArr);
    return max;
}
maximumSum2([-2,1,-3,4,-1,2,1,-5,4])