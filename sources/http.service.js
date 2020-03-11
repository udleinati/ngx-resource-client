/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { JsonapiConfig } from '../jsonapi-config';
import { share, tap } from 'rxjs/operators';
export class Http {
    /**
     * @param {?} request
     * @param {?} platformId
     * @param {?} http
     * @param {?} rsJsonapiConfig
     */
    constructor(request, platformId, http, rsJsonapiConfig) {
        this.request = request;
        this.platformId = platformId;
        this.http = http;
        this.rsJsonapiConfig = rsJsonapiConfig;
        this.get_requests = {};
    }
    /**
     * @param {?} path
     * @param {?} method
     * @param {?=} data
     * @return {?}
     */
    exec(path, method, data) {
        /** @type {?} */
        let url = this.rsJsonapiConfig.url;
        /** @type {?} */
        let req = {
            body: data || null,
            headers: new HttpHeaders({
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json'
            })
        };
        if (isPlatformServer(this.platformId) && !url.match(/^http\:|^https\:|^\/\//)) {
            /** @type {?} */
            const headers = this.request.headers;
            /** @type {?} */
            const proto = (headers['x-forwarded-proto']) ? headers['x-forwarded-proto'].split(',')[0] : (headers['proto']) ? headers['proto'] : 'http';
            /** @type {?} */
            const host = (headers['x-forwarded-host']) ? headers['x-forwarded-host'].split(',')[0] : headers['host'];
            url = `${proto}://${host}${url}`;
        }
        // NOTE: prevent duplicate GET requests
        if (method === 'get') {
            if (!this.get_requests[path]) {
                /** @type {?} */
                let obs = this.http.request(method, url + path, req).pipe(tap(() => {
                    delete this.get_requests[path];
                }), share());
                this.get_requests[path] = obs;
                return obs;
            }
            return this.get_requests[path];
        }
        return this.http.request(method, url + path, req).pipe(tap(() => {
            delete this.get_requests[path];
        }), share());
    }
}
Http.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Http.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [REQUEST,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: HttpClient },
    { type: JsonapiConfig }
];
if (false) {
    /** @type {?} */
    Http.prototype.get_requests;
    /** @type {?} */
    Http.prototype.request;
    /** @type {?} */
    Http.prototype.platformId;
    /** @type {?} */
    Http.prototype.http;
    /** @type {?} */
    Http.prototype.rsJsonapiConfig;
}
//# sourceMappingURL=http.service.js.map