/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
export default function updateSubtreeElements(children, map, dontUpdate) {
    let children2 = [], children3 = children, isUpdated = false;
    if (!Array.isArray(children)) children3 = [children];
    
    const mapChild = child => {
        if (child?.props?.children && typeof(child.props.children) != 'string') {
            const grandChildren = updateSubtreeElements(child.props.children, map);
            if (grandChildren !== child.props.children) {
                const props = {...child.props, children: grandChildren};
                child = {...child, props}; //escape the freezed object (props)
                isUpdated = true;
            }
        }
        let child2 = map(child);
        if (child2 !== child) isUpdated = true;
        return child2;
    }
    
    for (let child of children3) {
        let child2;
        if (dontUpdate && dontUpdate(child)) {
            child2 = child;
        }
        else {
            if (Array.isArray(child)) {
                for (let i = 0; i < child.length; i++) {
                    child[i] = mapChild(child[i]);
                }
                child2 = child;
            }
            else {
                child2 = mapChild(child);
            }
        }
        children2.push(child2);
    }
    return isUpdated ? children2 : children;
}