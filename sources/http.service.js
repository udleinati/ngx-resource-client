/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JsonapiConfig } from '../jsonapi-config';
import { share } from 'rxjs/operators';
export class Http {
    /**
     * @param {?} http
     * @param {?} rsJsonapiConfig
     */
    constructor(http, rsJsonapiConfig) {
        this.http = http;
        this.rsJsonapiConfig = rsJsonapiConfig;
    }
    /**
     * @param {?} path
     * @param {?} method
     * @param {?=} data
     * @return {?}
     */
    exec(path, method, data) {
        /** @type {?} */
        let req = {
            body: data || null,
            headers: new HttpHeaders({
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json'
            })
        };
        /** @type {?} */
        let obs = this.http.request(method, path, req);
        if (method === 'get') {
            obs.pipe(share());
        }
        return obs;
    }
}
Http.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Http.ctorParameters = () => [
    { type: HttpClient },
    { type: JsonapiConfig }
];
if (false) {
    /** @type {?} */
    Http.prototype.http;
    /** @type {?} */
    Http.prototype.rsJsonapiConfig;
}
//# sourceMappingURL=http.service.js.map