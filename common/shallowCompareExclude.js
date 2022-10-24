/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 * 
 * Overrides `shallowCompare` by excluding some properties from comparison
 */
export default (component, nextProps, nextState, ...exludes) => {
    const excludedSet = new Set(exludes);
    let obj1 = component.props ?? {}, obj2 = nextProps ?? {};
    if (Object.keys(obj1).length != Object.keys(obj2).length) return true;
    for (let propName in obj1) {
        if (excludedSet.has(propName)) continue;
        if (!Object.is(obj1[propName], obj2[propName])) return true;
    }
    obj1 = component.state ?? {}, obj2 = nextState ?? {};
    if (Object.keys(obj1).length != Object.keys(obj2).length) return true;
    for (let stateName in obj1) {
        if (!Object.is(obj1[stateName], obj2[stateName])) return true;
    }
    return false;
}
