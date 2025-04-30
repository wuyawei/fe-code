/* 
给你一个正整数 n ，生成一个包含 1 到 n² 所有元素，且元素按顺时针顺序螺旋排列的 n x n 正方形矩阵 matrix 。

示例 1：
输入：n = 3
输出：[[1,2,3],[8,9,4],[7,6,5]]

示例 2：
输入：n = 1
输出：[[1]]

提示：
1 <= n <= 20
*/

/**
 * @param {number} n
 * @return {number[][]}
 */
var generateMatrix = function(n) {
    // 创建一个 n x n 的二维数组
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    
    let num = 1; // 当前要填入的数字
    let top = 0;
    let bottom = n - 1;
    let left = 0;
    let right = n - 1;
    
    while (num <= n * n) {
        // 从左到右填充上边界
        for (let i = left; i <= right; i++) {
            matrix[top][i] = num++;
        }
        top++;
        
        // 从上到下填充右边界
        for (let i = top; i <= bottom; i++) {
            matrix[i][right] = num++;
        }
        right--;
        
        // 从右到左填充下边界
        for (let i = right; i >= left; i--) {
            matrix[bottom][i] = num++;
        }
        bottom--;
        
        // 从下到上填充左边界
        for (let i = bottom; i >= top; i--) {
            matrix[i][left] = num++;
        }
        left++;
    }
    
    return matrix;
}; 