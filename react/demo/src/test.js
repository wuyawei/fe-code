let treeData = [
    {
        title: '1',
        key: '1',
        children: [
            {
                title: '1-1',
                key: '1-1',
                children: [
                    {
                        title: '1-1-1',
                        key: '1-1-1'
                    }
                ]
            }
        ]
    },
    {
        title: '2',
        key: '2'
    }
]

let tableData = [

]

const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };