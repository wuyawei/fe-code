class Unit {
    constructor(element) {
        this.currElement = element;
    }
}

class ReactTextUnit extends Unit {
    getMarkUp(rootid){
        return this.currElement;
    }
}

class ReactNativeUnit extends Unit {
    getMarkUp(rootid){
        this._rootid = rootid;
        const {props, type} = this.currElement;
        let tagStart = `<${type} data-reactid=${this._rootid}`;
        let contentStr = '';
        Object.keys(props).forEach(propName => {
            if (/on[A-Z]/.test(propName) && typeof props[propName] === 'function'){
                const event = propName.slice(2).toLowerCase();
                document.addEventListener(event, (e) => {
                    if (e.target.dataset.reactid === this._rootid) {
                        props[propName](e);
                    }
                })
            }else if (propName === 'children') {
                contentStr = props[propName].map((child, i) => {
                    const childUnitInstance = createReactUnit(child);
                    return childUnitInstance.getMarkUp(`${this._rootid}-${i}`);
                }).join('');
            } else {
                tagStart +=` ${propName}=${props[propName]}`;
            }
        })
        const tagEnd = `</${type}>`;
        return tagStart + '>' + contentStr + tagEnd;
    }
}

class ReactCompositionUnit extends Unit {
    getMarkUp(rootid){
        this._rootid = rootid;
        const {props, type:Component} = this.currElement;
        const componentInstance = new Component(props);
        const rendered = componentInstance.render();
        const renderedInstance = createReactUnit(rendered);
        return renderedInstance.getMarkUp(this._rootid);
    }
}

const createReactUnit = (element) => {
    if(typeof element === 'string' || typeof element === 'number'){
        return new ReactTextUnit(element);
    }
    if(typeof element === 'object' && typeof element.type === 'string'){
        return new ReactNativeUnit(element);
    }
    if(typeof element === 'object' && typeof element.type === 'function'){
        return new ReactCompositionUnit(element);
    }
}

export default createReactUnit;