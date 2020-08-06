/* Input: [-2,1,-3,4,-1,2,1,-5,4],
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6. */

const maximumSun = (arr) => {
    let maximumSunArr = [];
    let max = null;
    for(let i = 0; i < arr.length; i++) {
        for(let j = i+1; j < arr.length; j++) {
            const _arr = arr.slice(i, j+1);
            const sun = _arr.reduce((pre, cur) => pre + cur);
            console.log("maximumSun -> sun", i, j, _arr)
            maximumSunArr = (max === null || sun > max) ? _arr : maximumSunArr;
            max = (max === null || sun > max) ? sun : max;
        }
    }
    console.log("maximumSun -> maximumSunArr", max)
    return max;
}
maximumSun([-2,1,-3,4,-1,2,1,-5,4])