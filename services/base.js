/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Page } from './page';
import { DocumentCollection } from '../document-collection';
export class Base {
    /**
     * @template R
     * @return {?}
     */
    static newCollection() {
        return new DocumentCollection();
    }
    /**
     * @param {?} ttl
     * @param {?} last_update
     * @return {?}
     */
    static isObjectLive(ttl, last_update) {
        return ttl >= 0 && Date.now() <= last_update + ttl * 1000;
    }
    /**
     * @template T
     * @param {?} collection
     * @param {?} fc
     * @return {?}
     */
    static forEach(collection, fc) {
        Object.keys(collection).forEach(key => {
            fc(collection[key], key);
        });
    }
}
Base.ParamsResource = {
    beforepath: '',
    ttl: null,
    include: [],
    id: ''
};
Base.ParamsCollection = {
    beforepath: '',
    ttl: null,
    include: [],
    remotefilter: {},
    smartfilter: {},
    sort: [],
    page: new Page(),
    storage_ttl: 0,
    cachehash: ''
};
if (false) {
    /** @type {?} */
    Base.ParamsResource;
    /** @type {?} */
    Base.ParamsCollection;
}
//# sourceMappingURL=base.js.map