// 定义React元素类型常量

export const types = {
  // 元素类型
  ELEMENT_TEXT: 'TEXT_ELEMENT',     // 文本元素
  ELEMENT_NATIVE: 'NATIVE_ELEMENT', // 原生DOM元素
  ELEMENT_COMPONENT: 'COMPONENT_ELEMENT', // 自定义组件元素
  
  // 更新类型
  UPDATE_PROPS: 'UPDATE_PROPS',     // 更新属性
  UPDATE_TEXT: 'UPDATE_TEXT',       // 更新文本内容
  UPDATE_CHILDREN: 'UPDATE_CHILDREN', // 更新子元素
  
  // 操作类型
  PLACEMENT: 'PLACEMENT',           // 新增节点
  UPDATE: 'UPDATE',                 // 更新节点
  DELETION: 'DELETION'              // 删除节点
}; 