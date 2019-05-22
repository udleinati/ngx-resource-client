/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Base } from './base';
import { Converter } from './converter';
import { DocumentCollection } from '../document-collection';
// unsupported: template constraints.
/**
 * @template R
 */
export class CacheMemory {
    constructor() {
        this.resources = {};
        this.collections = {};
        this.collections_lastupdate = {};
    }
    /**
     * @param {?} url
     * @return {?}
     */
    isCollectionExist(url) {
        return url in this.collections && this.collections[url].source !== 'new' ? true : false;
    }
    /**
     * @param {?} url
     * @param {?} ttl
     * @return {?}
     */
    isCollectionLive(url, ttl) {
        return Date.now() <= this.collections_lastupdate[url] + ttl * 1000;
    }
    /**
     * @param {?} id
     * @param {?} ttl
     * @return {?}
     */
    isResourceLive(id, ttl) {
        return this.resources[id] && Date.now() <= this.resources[id].lastupdate + ttl * 1000;
    }
    /**
     * @param {?} url
     * @return {?}
     */
    getOrCreateCollection(url) {
        if (!(url in this.collections)) {
            this.collections[url] = new DocumentCollection();
            this.collections[url].source = 'new';
        }
        return this.collections[url];
    }
    /**
     * @param {?} url
     * @param {?} collection
     * @return {?}
     */
    setCollection(url, collection) {
        // v1: clone collection, because after maybe delete items for localfilter o pagination
        if (!(url in this.collections)) {
            this.collections[url] = new DocumentCollection();
        }
        for (let i = 0; i < collection.data.length; i++) {
            /** @type {?} */
            let resource = collection.data[i];
            // this.collections[url].data.push(resource);
            this.setResource(resource);
        }
        this.collections[url].data = collection.data;
        this.collections[url].page = collection.page;
        this.collections_lastupdate[url] = Date.now();
    }
    /**
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    getOrCreateResource(type, id) {
        if (Converter.getService(type).cachememory && id in Converter.getService(type).cachememory.resources) {
            return Converter.getService(type).cachememory.resources[id];
        }
        else {
            /** @type {?} */
            let resource = Converter.getService(type).new();
            resource.id = id;
            // needed for a lot of request (all and get, tested on multinexo.com)
            this.setResource(resource, false);
            return resource;
        }
    }
    /**
     * @param {?} resource
     * @param {?=} update_lastupdate
     * @return {?}
     */
    setResource(resource, update_lastupdate = false) {
        if (resource.id in this.resources) {
            this.addResourceOrFill(resource);
        }
        else {
            this.resources[resource.id] = resource;
        }
        this.resources[resource.id].lastupdate = update_lastupdate ? Date.now() : 0;
    }
    /**
     * @param {?} path_start_with
     * @return {?}
     */
    deprecateCollections(path_start_with) {
        Base.forEach(this.collections_lastupdate, (lastupdate, key) => {
            this.collections_lastupdate[key] = 0;
        });
        return true;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    removeResource(id) {
        Base.forEach(this.collections, (value, url) => {
            delete value[id];
        });
        this.resources[id].attributes = {}; // just for confirm deletion on view
        // this.resources[id].relationships = {}; // just for confirm deletion on view
        for (let relationship in this.resources[id].relationships) {
            if (this.resources[id].relationships[relationship].data.constructor === Array) {
                this.resources[id].relationships[relationship].data = []; // just in case that there is a for loop using it
            }
            else if (this.resources[id].relationships[relationship].data.constructor === Object) {
                delete this.resources[id].relationships[relationship].data;
            }
        }
        delete this.resources[id];
    }
    /**
     * @param {?} source
     * @return {?}
     */
    addResourceOrFill(source) {
        /** @type {?} */
        let destination = this.resources[source.id];
        destination.attributes = source.attributes;
        // remove relationships on destination resource
        for (let type_alias in destination.relationships) {
            // problem with no declared services
            if (destination.relationships[type_alias].data === undefined) {
                continue;
            }
            if (!(type_alias in source.relationships)) {
                delete destination.relationships[type_alias];
            }
            else {
                /** @type {?} */
                let collection = /** @type {?} */ (destination.relationships[type_alias]);
                // TODO: talkto Pablo, this could be and Object... (following IF statement added by Maxi)
                if (!Array.isArray(collection.data)) {
                    continue;
                }
                for (let resource of collection.data) {
                    if (collection.find(resource.id) === null) {
                        delete destination.relationships[type_alias];
                    }
                }
            }
        }
        // add source relationships to destination
        for (let type_alias in source.relationships) {
            // problem with no declared services
            if (source.relationships[type_alias].data === undefined) {
                continue;
            }
            if ('id' in source.relationships[type_alias].data) {
                destination.addRelationship(/** @type {?} */ (source.relationships[type_alias].data), type_alias);
            }
            else {
                destination.addRelationships(/** @type {?} */ (source.relationships[type_alias].data), type_alias);
            }
        }
    }
}
if (false) {
    /** @type {?} */
    CacheMemory.prototype.resources;
    /** @type {?} */
    CacheMemory.prototype.collections;
    /** @type {?} */
    CacheMemory.prototype.collections_lastupdate;
}
//# sourceMappingURL=cachememory.js.map