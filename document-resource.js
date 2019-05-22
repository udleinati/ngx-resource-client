/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Resource } from './resource';
import { Page } from './services/page';
import { Document } from './document';
// unsupported: template constraints.
/**
 * @template R
 */
export class DocumentResource extends Document {
    constructor() {
        super(...arguments);
        this.data = /** @type {?} */ (new Resource());
        this.builded = false;
        this.content = 'id';
        this.page = new Page();
    }
    /**
     * @param {?} data_resource
     * @return {?}
     */
    fill(data_resource) {
        this.data_resource = data_resource;
        this.data.fill(data_resource);
        this.meta = data_resource.meta || {};
    }
}
if (false) {
    /** @type {?} */
    DocumentResource.prototype.data;
    /** @type {?} */
    DocumentResource.prototype.builded;
    /** @type {?} */
    DocumentResource.prototype.content;
    /** @type {?} */
    DocumentResource.prototype.data_resource;
    /** @type {?} */
    DocumentResource.prototype.page;
}
//# sourceMappingURL=document-resource.js.map