import createReactUnit from './unit.js';
import createElement from './element.js';
import Component from './component.js';

const React = {
    nextRootIndex: '0',
    createElement,
    Component
}

// 保存根组件信息（使用单一全局变量）
let rootComponent = null;
let rootContainer = null;
let rootId = null;

// 事件注册记录，避免重复添加事件监听
const eventRegistry = {};

/**
 * 简化版render函数 - 直接渲染React元素到DOM容器
 * 不使用复杂状态管理，确保清晰和可靠性
 * 
 * @param {Object} element - React元素
 * @param {HTMLElement} container - DOM容器
 */
const render = (element, container) => {
    // 安全检查
    if (!element || !container) {
        console.error('无效的渲染参数:', element, container);
        return;
    }
    
    console.log('执行React渲染');
    
    // 保存对根组件的引用，用于后续更新
    rootComponent = element;
    rootContainer = container;
    rootId = '0';
    
    // 创建React单元
    const reactUnit = createReactUnit(element);
    
    // 生成HTML
    const markUp = reactUnit.getMarkUp('0');
    
    // 渲染到DOM
    container.innerHTML = markUp;
    
    // 注册事件
    if (reactUnit.registerDOMEvents) {
        reactUnit.registerDOMEvents();
    }
    
    console.log('React渲染完成');
}

// 设置React.render方法
React.render = render;

// 添加辅助方法用于处理事件
React.registerEvent = (type, reactId, callback) => {
    // 安全检查
    if (!type || !reactId || typeof callback !== 'function') {
        console.error('无效的事件注册参数:', { type, reactId });
        return;
    }
    
    // 格式化事件类型和ID
    const eventKey = `${type}_${reactId}`;
    
    // 避免重复绑定
    if (eventRegistry[eventKey]) {
        // 如果回调函数相同，直接跳过
        if (eventRegistry[eventKey].callback === callback) {
            return;
        }
        // 否则先移除旧的事件监听
        document.removeEventListener(type, eventRegistry[eventKey].handler);
    }
    
    // 创建并存储事件处理函数
    const handler = (e) => {
        try {
            if (e.target.dataset && e.target.dataset.reactid === reactId) {
                callback(e);
            }
        } catch (error) {
            console.error(`事件处理错误 (${type}:${reactId}):`, error);
        }
    };
    
    eventRegistry[eventKey] = {
        handler,
        callback
    };
    document.addEventListener(type, handler);
};

// 移除事件监听
React.unregisterEvent = (type, reactId) => {
    if (!type || !reactId) {
        return;
    }
    
    const eventKey = `${type}_${reactId}`;
    if (eventRegistry[eventKey]) {
        document.removeEventListener(type, eventRegistry[eventKey].handler);
        delete eventRegistry[eventKey];
    }
};

export default React;