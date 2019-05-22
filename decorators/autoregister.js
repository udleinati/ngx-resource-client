/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @return {?}
 */
export function Autoregister() {
    return (target) => {
        /** @type {?} */
        const original = target;
        /** @type {?} */
        const newConstructor = function newCtor(...args) {
            /** @type {?} */
            const c = function childConstuctor() {
                return original.apply(this, arguments);
            };
            c.prototype = Object.create(original.prototype);
            /** @type {?} */
            const instance = new c(...args);
            instance.register();
            return instance;
        };
        newConstructor.prototype = Object.create(target.prototype);
        return newConstructor;
    };
}
//# sourceMappingURL=autoregister.js.map