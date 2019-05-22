/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Core } from './core';
import { Base } from './services/base';
import { Resource } from './resource';
import { PathBuilder } from './services/path-builder';
import { Converter } from './services/converter';
import { CacheMemory } from './services/cachememory';
import { CacheStore } from './services/cachestore';
import { DocumentCollection } from './document-collection';
import { isLive } from './common';
import { BehaviorSubject, Subject } from 'rxjs';
import { PathCollectionBuilder } from './services/path-collection-builder';
// unsupported: template constraints.
/**
 * @template R
 */
export class Service {
    constructor() {
        this.resource = Resource;
    }
    /**
     * @return {?}
     */
    register() {
        if (Core.me === null) {
            throw new Error('Error: you are trying register `' + this.type + '` before inject JsonapiCore somewhere, almost one time.');
        }
        // only when service is registered, not cloned object
        this.cachememory = new CacheMemory();
        this.cachestore = new CacheStore();
        return Core.me.registerService(this);
    }
    /**
     * @return {?}
     */
    newResource() {
        /** @type {?} */
        let resource = new this.resource();
        return /** @type {?} */ (resource);
    }
    /**
     * @return {?}
     */
    newCollection() {
        return new DocumentCollection();
    }
    /**
     * @return {?}
     */
    new() {
        /** @type {?} */
        let resource = this.newResource();
        resource.type = this.type;
        // issue #36: just if service is not registered yet.
        this.getService();
        resource.reset();
        return resource;
    }
    /**
     * @return {?}
     */
    getPrePath() {
        return '';
    }
    /**
     * @return {?}
     */
    getPath() {
        return this.path || this.type;
    }
    /**
     * @param {?} id
     * @param {?=} params
     * @return {?}
     */
    pathForGet(id, params = {}) {
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        let path = new PathBuilder();
        path.applyParams(this, params);
        path.appendPath(id);
        path.setApiBaseUrl(this.apiBaseUrl);
        return path.get();
    }
    /**
     * @param {?} id
     * @param {?=} params
     * @return {?}
     */
    get(id, params = {}) {
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        let path = new PathBuilder();
        path.applyParams(this, params);
        path.appendPath(id);
        path.setApiBaseUrl(this.apiBaseUrl);
        /** @type {?} */
        let resource = this.getOrCreateResource(id);
        resource.is_loading = true;
        /** @type {?} */
        let subject = new BehaviorSubject(resource);
        if (isLive(resource, params.ttl)) {
            subject.complete();
            resource.is_loading = false;
        }
        else if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
            // CACHESTORE
            this.getService()
                .cachestore.getResource(resource, params.include)
                .then(() => {
                if (!isLive(resource, params.ttl)) {
                    subject.next(resource);
                    throw new Error('No está viva la caché de localstorage');
                }
                resource.is_loading = false;
                subject.next(resource);
                subject.complete();
            })
                .catch(() => {
                this.getGetFromServer(path, resource, subject);
            });
        }
        else {
            this.getGetFromServer(path, resource, subject);
        }
        subject.next(resource);
        return subject.asObservable();
    }
    /**
     * @param {?} path
     * @param {?} resource
     * @param {?} subject
     * @return {?}
     */
    getGetFromServer(path, resource, subject) {
        Core.get(path.get()).subscribe(success => {
            resource.fill(/** @type {?} */ (success));
            resource.is_loading = false;
            this.getService().cachememory.setResource(resource);
            if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
                this.getService().cachestore.setResource(resource);
            }
            subject.next(resource);
            subject.complete();
        }, error => {
            subject.error(error);
        });
    }
    /**
     * @template T
     * @return {?}
     */
    getService() {
        return /** @type {?} */ ((Converter.getService(this.type) || this.register()));
    }
    /**
     * @param {?} path
     * @return {?}
     */
    getOrCreateCollection(path) {
        /** @type {?} */
        let collection = /** @type {?} */ (this.getService().cachememory.getOrCreateCollection(path.getForCache()));
        return collection;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    getOrCreateResource(id) {
        /** @type {?} */
        let service = this.getService();
        if (service.cachememory && id in service.cachememory.resources) {
            return /** @type {?} */ (service.cachememory.resources[id]);
        }
        else {
            /** @type {?} */
            let resource = service.new();
            resource.id = id;
            service.cachememory.setResource(resource, false);
            return /** @type {?} */ (resource);
        }
    }
    /**
     * @return {?}
     */
    clearCacheMemory() {
        /** @type {?} */
        let path = new PathBuilder();
        path.applyParams(this);
        path.setApiBaseUrl(this.apiBaseUrl);
        return (this.getService().cachememory.deprecateCollections(path.getForCache()) &&
            this.getService().cachestore.deprecateCollections(path.getForCache()));
    }
    /**
     * @param {?} attributes
     * @return {?}
     */
    parseToServer(attributes) {
        /* */
    }
    /**
     * @param {?} attributes
     * @return {?}
     */
    parseFromServer(attributes) {
        /* */
    }
    /**
     * @param {?} id
     * @param {?=} params
     * @return {?}
     */
    delete(id, params) {
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        let path = new PathBuilder();
        path.applyParams(this, params);
        path.appendPath(id);
        path.setApiBaseUrl(this.apiBaseUrl);
        /** @type {?} */
        let subject = new Subject();
        Core.delete(path.get()).subscribe(success => {
            this.getService().cachememory.removeResource(id);
            subject.next();
            subject.complete();
        }, error => {
            subject.error(error);
        });
        return subject.asObservable();
    }
    /**
     * @param {?=} params
     * @param {?=} apiBaseUrl
     * @return {?}
     */
    pathForAll(params = {}, apiBaseUrl = '') {
        params = Object.assign({}, Base.ParamsCollection, params);
        /** @type {?} */
        let path = new PathCollectionBuilder();
        path.applyParams(this, params);
        path.setApiBaseUrl(this.apiBaseUrl);
        return path.get();
    }
    /**
     * @param {?=} params
     * @return {?}
     */
    all(params = {}) {
        params = Object.assign({}, Base.ParamsCollection, params);
        /** @type {?} */
        let path = new PathCollectionBuilder();
        path.applyParams(this, params);
        path.setApiBaseUrl(this.apiBaseUrl);
        /** @type {?} */
        let temporary_collection = this.getOrCreateCollection(path);
        temporary_collection.page.number = params.page.number * 1;
        /** @type {?} */
        let subject = new BehaviorSubject(temporary_collection);
        if (isLive(temporary_collection, params.ttl)) {
            temporary_collection.source = 'memory';
            subject.next(temporary_collection);
            setTimeout(() => subject.complete(), 0);
        }
        else if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
            // STORE
            temporary_collection.is_loading = true;
            this.getService()
                .cachestore.fillCollectionFromStore(path.getForCache(), path.includes, temporary_collection)
                .subscribe(() => {
                temporary_collection.source = 'store';
                // when load collection from store, we save collection on memory
                this.getService().cachememory.setCollection(path.getForCache(), temporary_collection);
                if (isLive(temporary_collection, params.ttl)) {
                    temporary_collection.is_loading = false;
                    subject.next(temporary_collection);
                    subject.complete();
                }
                else {
                    this.getAllFromServer(path, params, temporary_collection, subject);
                }
            }, err => {
                this.getAllFromServer(path, params, temporary_collection, subject);
            });
        }
        else {
            this.getAllFromServer(path, params, temporary_collection, subject);
        }
        return subject.asObservable();
    }
    /**
     * @param {?} path
     * @param {?} params
     * @param {?} temporary_collection
     * @param {?} subject
     * @return {?}
     */
    getAllFromServer(path, params, temporary_collection, subject) {
        temporary_collection.is_loading = true;
        subject.next(temporary_collection);
        Core.get(path.get()).subscribe(success => {
            temporary_collection.source = 'server';
            temporary_collection.is_loading = false;
            // this create a new ID for every resource (for caching proposes)
            // for example, two URL return same objects but with different attributes
            if (params.cachehash) {
                for (const key in success.data) {
                    /** @type {?} */
                    let resource = success.data[key];
                    resource.id = resource.id + params.cachehash;
                }
            }
            temporary_collection.fill(/** @type {?} */ (success));
            temporary_collection.cache_last_update = Date.now();
            this.getService().cachememory.setCollection(path.getForCache(), temporary_collection);
            if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
                this.getService().cachestore.setCollection(path.getForCache(), temporary_collection, params.include);
            }
            subject.next(temporary_collection);
            subject.complete();
        }, error => {
            // do not replace source, because localstorage don't write if = server
            // temporary_collection.source = 'server';
            temporary_collection.is_loading = false;
            subject.next(temporary_collection);
            subject.error(error);
        });
    }
}
if (false) {
    /** @type {?} */
    Service.prototype.cachememory;
    /** @type {?} */
    Service.prototype.cachestore;
    /** @type {?} */
    Service.prototype.type;
    /** @type {?} */
    Service.prototype.resource;
    /** @type {?} */
    Service.prototype.path;
    /** @type {?} */
    Service.prototype.apiBaseUrl;
}
//# sourceMappingURL=service.js.map