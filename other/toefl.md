1. 华为 mate9 自带浏览器不支持 es6 、fetch 及 css 的 flex语法（注：transform 支持）
2. 关于禁止 touchmove 滚动的几种处理方式
3. 移动端路由动画（translateY(0) 和 top 0 位置不一致及移动端状态栏影响，顶部出现下沉闪烁现象，暂用position: fixed 处理）
4. 楼层跳转滚动事件监听兼容性（document.body.scrollTop/document.documentElement.scrollTop）、元素可视区域计算、导航联动的附加数据处理。
5. 组件拆分需要更细致，有相同功能的 hooks 组合在一起（state/effect等）
6. ui 细节问题需要注意