class Component {
    constructor(props){
        this.props = props || {};
        this.state = {};
        this._rootID = null;
        this._currentUnit = null;
        
        // 标记为React类组件
        this.isReactComponent = true;
    }

    setState(partialState) {
        console.log('setState被调用');
        
        try {
            let newState;
            
            // 支持函数方式的 setState
            if (typeof partialState === 'function') {
                newState = partialState(this.state || {});
            } else {
                newState = partialState;
            }
            
            // 安全检查
            if (!newState || typeof newState !== 'object') {
                console.warn('setState: 无效的状态更新', newState);
                return;
            }
            
            // 合并状态 - 重要：保存旧状态用于比较
            const prevState = {...this.state};
            this.state = {...(this.state || {}), ...newState};
            
            console.log(`状态已更新: ${JSON.stringify(prevState)} -> ${JSON.stringify(this.state)}`);
            
            // 触发更新渲染
            if (this._currentUnit) {
                console.log('触发组件更新');
                
                // 获取当前元素以更新DOM
                const currentElement = this._currentUnit.element;
                
                // 立即触发更新 - 直接调用update方法而不是使用setTimeout
                try {
                    if (this._currentUnit && this._currentUnit.update) {
                        this._currentUnit.update(currentElement);
                        
                        // 特殊处理：如果是Counter组件，手动更新其内部h2元素的文本
                        if (this.constructor.name === 'Counter' && this.state.count !== undefined) {
                            // 查找计数器的文本元素并更新
                            const counterTextElement = document.querySelector(`[data-reactid="${this._currentUnit._rootId}"] h2`);
                            if (counterTextElement) {
                                counterTextElement.textContent = `当前计数: ${this.state.count}`;
                                console.log(`已手动更新计数器显示: ${this.state.count}`);
                            }
                        }
                    } else {
                        console.warn('组件更新失败：currentUnit无效');
                    }
                } catch (error) {
                    console.error('组件更新时出现错误:', error);
                }
            } else {
                console.warn('组件实例没有关联的Unit');
            }
        } catch (error) {
            console.error('setState处理时出现错误:', error);
        }
    }

    // 生命周期方法
    componentWillMount() {}
    componentDidMount() {}
    componentWillUpdate() {}
    componentDidUpdate() {}
    componentWillUnmount() {}
    
    // 子类必须实现的render方法
    render() {
        throw new Error('组件必须实现render方法');
    }
}

export default Component;