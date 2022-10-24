/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 */
import {proxyClass} from '../../common/proxy';

test('proxyClass', () => {
    class AClass {
        property1 = 1.1;
        property2 = 1.2;
        method1() {
            return this.property1;
        }
        method2() {
            return this.property2;
        }
    }

    const proxyObj = {
        property2: 2.2,
        property3: 2.3,
        method2() {
            return this.property2;
        },
        method3() {
            return this.property3;
        },
    };

    const ProxyAClass = proxyClass(AClass, () => proxyObj);
    const obj = new ProxyAClass();

    expect(obj.property1).toBe(1.1);
    expect(obj.property2).toBe(1.2);
    expect(obj.property3).toBe(2.3);
    expect(obj.property4).toBeUndefined();
    expect(obj.method1()).toBe(1.1);
    expect(obj.method2()).toBe(1.2);
    expect(obj.method3()).toBe(2.3);
});