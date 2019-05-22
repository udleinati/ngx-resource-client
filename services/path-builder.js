/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Core } from '../core';
export class PathBuilder {
    constructor() {
        this.paths = [];
        this.includes = [];
        this.get_params = [];
        this.apiBaseUrl = '';
    }
    /**
     * @param {?} service
     * @param {?=} params
     * @return {?}
     */
    applyParams(service, params = {}) {
        this.appendPath(service.getPrePath());
        if (params.beforepath) {
            this.appendPath(params.beforepath);
        }
        this.appendPath(service.getPath());
        if (params.include) {
            this.setInclude(params.include);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    appendPath(value) {
        if (value !== '') {
            this.paths.push(value);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setApiBaseUrl(value) {
        if (value !== '') {
            this.apiBaseUrl = value;
        }
    }
    /**
     * @return {?}
     */
    getForCache() {
        return this.paths.join('/') + this.get_params.join('/');
    }
    /**
     * @return {?}
     */
    get() {
        /** @type {?} */
        let params = [...this.get_params];
        if (this.includes.length > 0) {
            params.push('include=' + this.includes.join(','));
        }
        return this.apiBaseUrl + this.paths.join('/') + (params.length > 0 ? Core.injectedServices.rsJsonapiConfig.params_separator + params.join('&') : '');
    }
    /**
     * @param {?} strings_array
     * @return {?}
     */
    setInclude(strings_array) {
        this.includes = strings_array;
    }
}
if (false) {
    /** @type {?} */
    PathBuilder.prototype.paths;
    /** @type {?} */
    PathBuilder.prototype.includes;
    /** @type {?} */
    PathBuilder.prototype.get_params;
    /** @type {?} */
    PathBuilder.prototype.apiBaseUrl;
}
//# sourceMappingURL=path-builder.js.map