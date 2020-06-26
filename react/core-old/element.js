class Element {
    constructor(type, props) {
        this.type = type;
        this.props = props;
    }
}

const createElement = (type, props, ...children) => {
    props = props || {};
    props.children = children;
    return new Element(type, props);
}

export default createElement;