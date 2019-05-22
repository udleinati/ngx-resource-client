/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} cacheable
 * @param {?=} ttl
 * @return {?}
 */
export function isLive(cacheable, ttl = null) {
    return Date.now() <= cacheable.cache_last_update + (ttl || cacheable.ttl || 0) * 1000;
}
/**
 * @param {?} document
 * @return {?}
 */
export function isCollection(document) {
    return !('id' in document.data);
}
/**
 * @param {?} document
 * @return {?}
 */
export function isResource(document) {
    return 'id' in document.data;
}
//# sourceMappingURL=common.js.map