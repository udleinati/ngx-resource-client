/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { PathBuilder } from './path-builder';
import { UrlParamsBuilder } from './url-params-builder';
import { Core } from '../core';
export class PathCollectionBuilder extends PathBuilder {
    /**
     * @param {?} service
     * @param {?=} params
     * @return {?}
     */
    applyParams(service, params = {}) {
        super.applyParams(service, params);
        /** @type {?} */
        let paramsurl = new UrlParamsBuilder();
        if (params.remotefilter && Object.keys(params.remotefilter).length > 0) {
            if (service.parseToServer) {
                service.parseToServer(params.remotefilter);
            }
            this.addParam(paramsurl.toparams({ filter: params.remotefilter }));
        }
        if (params.page) {
            if (params.page.number > 1) {
                this.addParam(Core.injectedServices.rsJsonapiConfig.parameters.page.number + '=' + params.page.number);
            }
            if (params.page.size) {
                this.addParam(Core.injectedServices.rsJsonapiConfig.parameters.page.size + '=' + params.page.size);
            }
        }
        if (params.sort && params.sort.length) {
            this.addParam('sort=' + params.sort.join(','));
        }
    }
    /**
     * @param {?} param
     * @return {?}
     */
    addParam(param) {
        this.get_params.push(param);
    }
}
//# sourceMappingURL=path-collection-builder.js.map