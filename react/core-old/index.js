import createReactUnit from './unit';
import createElement from './element';
import Component from './component';

const React = {
    nextRootIndex: '0',
    createElement,
    Component
}
const render = (element, container) => {
    const createReactUnitInstance = createReactUnit(element);
    const markUp = createReactUnitInstance.getMarkUp(React.nextRootIndex);
    container.innerHTML = markUp;
}
React.render = render;
export default React;