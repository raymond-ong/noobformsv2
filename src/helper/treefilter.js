// Helper functions for filtering
export const defaultMatcher = (filterText, node) => {
    return node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
};

export const titleMatcher = (filterText, node) => {
    return node.title.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
};

// Returns true or false only
export const nodeExists = (node, filter, matcher) => {
    return matcher(filter, node) || // i match
        (node.children && // or i have decendents and one of them match
            node.children.length &&
            !!node.children.find(child => nodeExists(child, filter, matcher)));
};

export const filterTreeEx = (nodes, filter, matcher = titleMatcher) => {
    return nodes.reduce( (acc, curr) => {
        return acc.concat(filterTree(curr, filter, matcher))
    }, []);
};


export const filterTree = (node, filter, matcher = titleMatcher) => {
    // If im an exact match then all my children get to stay
    if (matcher(filter, node) || !node.children) {
        return node;
    }
    // If not then only keep the ones that match or have matching descendants
    const filtered = node.children
        .filter(child => nodeExists(child, filter, matcher))
        .map(child => filterTree(child, filter, matcher));
    return Object.assign({}, node, {children: filtered});
};

export const expandFilteredNodes = (node, filter, matcher = defaultMatcher) => {
    let children = node.children;
    if (!children || children.length === 0) {
        return Object.assign({}, node, {toggled: false});
    }
    const childrenWithMatches = node.children.filter(child => nodeExists(child, filter, matcher));
    const shouldExpand = childrenWithMatches.length > 0;
    // If im going to expand, go through all the matches and see if thier children need to expand
    if (shouldExpand) {
        children = childrenWithMatches.map(child => {
            return expandFilteredNodes(child, filter, matcher);
        });
    }
    return Object.assign({}, node, {
        children: children,
        toggled: shouldExpand
    });
};

export const findNodeByKey = (data, key) => {
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.key === key) {        
            return {
                item,
                index: i,
                parentArr: data
            };
        }
        if (item.children) {
            let childFind = findNodeByKey(item.children, key);
            if (childFind) {
                return childFind;
            }
        }
    }
}