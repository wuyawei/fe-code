import React from './index.js';

// 函数组件示例
function Welcome(props) {
  // 添加固定样式确保位置稳定
  const style = {
    color: props.color
  };
  
  return React.createElement('h1', { style }, `你好，${props.name}`);
}

// 类组件示例 - 计数器
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    console.log('Counter组件已挂载');
  }

  componentDidUpdate() {
    console.log('Counter组件已更新，当前计数:', this.state.count);
  }

  handleClick() {
    this.setState(prevState => ({
      count: prevState.count + 1
    }));
  }

  render() {
    return React.createElement('div', { className: 'counter' },
      React.createElement('h2', null, `当前计数: ${this.state.count}`),
      React.createElement('button', 
        { onClick: this.handleClick, style: { padding: '5px', margin: '10px' } }, 
        '增加'
      )
    );
  }
}

// 主应用组件
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      showCounter: true,
      welcomeColor: 'blue'
    };
    this.toggleCounter = this.toggleCounter.bind(this);
    this.changeColor = this.changeColor.bind(this);
  }

  toggleCounter() {
    this.setState(prevState => ({
      showCounter: !prevState.showCounter
    }));
  }

  changeColor() {
    const colors = ['red', 'blue', 'green', 'purple', 'orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.setState({ welcomeColor: randomColor });
  }

  render() {
    const mainContainerStyle = {
      fontFamily: 'Arial',
      padding: '20px',
    };
    
    // 标题区域容器
    const headerStyle = {
      marginBottom: '20px',
      display: 'block'
    };
    
    // 按钮区域容器
    const buttonAreaStyle = {
      marginBottom: '20px',
      gap: '10px'
    };
    
    // 计数器区域容器
    const counterAreaStyle = {
      display: 'block'
    };
    
    // 创建并返回根元素与更清晰的DOM结构
    return React.createElement('div', { style: mainContainerStyle },
      // 标题区域
      React.createElement('div', { style: headerStyle, className: 'welcome-area' },
        React.createElement(Welcome, { name: '张三', color: this.state.welcomeColor })
      ),
      
      // 按钮区域
      React.createElement('div', { style: buttonAreaStyle, className: 'button-area' },
        React.createElement('button', {
          onClick: this.changeColor,
          style: { padding: '5px 10px' }
        }, '改变颜色'),
        
        React.createElement('button', {
          onClick: this.toggleCounter,
          style: { padding: '5px 10px' }
        }, this.state.showCounter ? '隐藏计数器' : '显示计数器')
      ),
      
      // 计数器区域 - 条件渲染
      this.state.showCounter ? 
        React.createElement('div', { style: counterAreaStyle, className: 'counter-area' },
          React.createElement(Counter, null)
        ) : null
    );
  }
}

// 应用启动函数 - 极度简化版本
function startApp() {
  console.log('===== 启动React应用 =====');
  
  // 直接获取根元素
  const rootElement = document.getElementById('root');
  
  // 确保根元素是空的
  rootElement.innerHTML = '';
  
  // 创建应用组件
  const app = React.createElement(App);
  
  // 一次性渲染到DOM
  React.render(app, rootElement);
  
  console.log('===== 应用渲染完成 =====');
}

// 直接导出函数，不进行任何自动执行
export default startApp; 