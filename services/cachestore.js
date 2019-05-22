var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Core } from '../core';
import { Base } from './base';
import { Converter } from './converter';
import { DocumentCollection } from '../document-collection';
import { Subject } from 'rxjs';
import { Page } from './page';
import { DocumentResource } from '../document-resource';
import { isDevMode } from '@angular/core';
export class CacheStore {
    /**
     * @param {?} resource
     * @param {?=} include
     * @return {?}
     */
    getResource(resource, include = []) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            let mypromise = new Promise((resolve, reject) => {
                Core.injectedServices.JsonapiStoreService.getDataObject(resource.type, resource.id).subscribe(success => {
                    resource.fill({ data: success });
                    /** @type {?} */
                    let include_promises = [];
                    for (let resource_alias of include) {
                        this.fillRelationshipFromStore(resource, resource_alias, include_promises);
                    }
                    // resource.lastupdate = success._lastupdate_time;
                    // no debo esperar a que se resuelvan los include
                    if (include_promises.length === 0) {
                        resolve(success);
                    }
                    else {
                        // esperamos las promesas de los include antes de dar el resolve
                        Promise.all(include_promises)
                            .then(success3 => {
                            resolve(success3);
                        })
                            .catch(error3 => {
                            reject(error3);
                        });
                    }
                }, () => {
                    reject();
                });
            });
            return mypromise;
        });
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    setResource(resource) {
        Core.injectedServices.JsonapiStoreService.saveResource(resource.type, resource.id, resource.toObject().data);
    }
    /**
     * @param {?} url
     * @param {?} collection
     * @param {?} include
     * @return {?}
     */
    setCollection(url, collection, include) {
        /** @type {?} */
        let tmp = { data: [], page: new Page() };
        /** @type {?} */
        let resources_for_save = {};
        for (let resource of collection.data) {
            this.setResource(resource);
            tmp.data.push({ id: resource.id, type: resource.type });
            for (let resource_type_alias of include) {
                if ('id' in resource.relationships[resource_type_alias].data) {
                    /** @type {?} */
                    let ress = /** @type {?} */ (resource.relationships[resource_type_alias].data);
                    resources_for_save[resource_type_alias + ress.id] = ress;
                }
                else {
                    /** @type {?} */
                    let collection2 = /** @type {?} */ (resource.relationships[resource_type_alias].data);
                    for (let inc_resource of collection2) {
                        resources_for_save[resource_type_alias + inc_resource.id] = inc_resource;
                    }
                }
            }
        }
        tmp.page = collection.page;
        Core.injectedServices.JsonapiStoreService.saveCollection(url, /** @type {?} */ (tmp));
        Base.forEach(resources_for_save, resource_for_save => {
            if (!('is_new' in resource_for_save)) {
                // console.warn('No se pudo guardar en la cache', resource_for_save.type, 'por no se ser Resource.', resource_for_save);
                return;
            }
            if (Object.keys(resource_for_save.attributes).length === 0) {
                console.warn('No se pudo guardar en la cache', resource_for_save.type, 'por no tener attributes.', resource_for_save);
                return;
            }
            this.setResource(resource_for_save);
        });
    }
    /**
     * @param {?} path_start_with
     * @return {?}
     */
    deprecateCollections(path_start_with) {
        Core.injectedServices.JsonapiStoreService.deprecateObjectsWithKey('collection.' + path_start_with);
        return true;
    }
    /**
     * @param {?} url
     * @param {?} include
     * @param {?} collection
     * @return {?}
     */
    fillCollectionFromStore(url, include, collection) {
        /** @type {?} */
        let subject = new Subject();
        Core.injectedServices.JsonapiStoreService.getDataObject('collection', url).subscribe(data_collection => {
            // build collection from store and resources from memory
            if (this.fillCollectionWithArrrayAndResourcesOnMemory(data_collection.data, collection)) {
                collection.source = 'store'; // collection from storeservice, resources from memory
                collection.cache_last_update = data_collection._lastupdate_time;
                subject.next(collection);
                subject.complete();
                return;
            }
            /** @type {?} */
            let promise2 = this.fillCollectionWithArrrayAndResourcesOnStore(data_collection, include, collection);
            promise2
                .then(() => {
                // just for precaution, we not rewrite server data
                if (collection.source !== 'new') {
                    console.warn('ts-angular-json: esto no debería pasar. buscar eEa2ASd2#', collection);
                    throw new Error('ts-angular-json: esto no debería pasar. buscar eEa2ASd2#');
                }
                collection.source = 'store'; // collection and resources from storeservice
                collection.cache_last_update = data_collection._lastupdate_time;
                subject.next(collection);
                setTimeout(() => subject.complete());
            })
                .catch(err => subject.error(err));
        }, err => subject.error(err));
        return subject;
    }
    /**
     * @param {?} dataresources
     * @param {?} collection
     * @return {?}
     */
    fillCollectionWithArrrayAndResourcesOnMemory(dataresources, collection) {
        /** @type {?} */
        let all_ok = true;
        for (let dataresource of dataresources) {
            /** @type {?} */
            let resource = this.getResourceFromMemory(dataresource);
            if (resource.is_new) {
                all_ok = false;
                break;
            }
            collection.replaceOrAdd(resource);
        }
        return all_ok;
    }
    /**
     * @param {?} dataresource
     * @return {?}
     */
    getResourceFromMemory(dataresource) {
        /** @type {?} */
        let cachememory = Converter.getService(dataresource.type).cachememory;
        /** @type {?} */
        let resource = cachememory.getOrCreateResource(dataresource.type, dataresource.id);
        return resource;
    }
    /**
     * @param {?} datacollection
     * @param {?} include
     * @param {?} collection
     * @return {?}
     */
    fillCollectionWithArrrayAndResourcesOnStore(datacollection, include, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            let promise = new Promise((resolve, reject) => {
                /** @type {?} */
                let resources_by_id = {};
                /** @type {?} */
                let required_store_keys = datacollection.data.map(dataresource => {
                    /** @type {?} */
                    let cachememory = Converter.getService(dataresource.type).cachememory;
                    resources_by_id[dataresource.id] = cachememory.getOrCreateResource(dataresource.type, dataresource.id);
                    return resources_by_id[dataresource.id].type + '.' + dataresource.id;
                });
                // get resources for collection fill
                Core.injectedServices.JsonapiStoreService.getDataResources(required_store_keys)
                    .then(store_data_resources => {
                    /** @type {?} */
                    let include_promises = [];
                    for (let key in store_data_resources) {
                        /** @type {?} */
                        let data_resource = store_data_resources[key];
                        resources_by_id[data_resource.id].fill({ data: data_resource });
                        // include some times is a collection :S
                        Base.forEach(include, resource_alias => {
                            this.fillRelationshipFromStore(resources_by_id[data_resource.id], resource_alias, include_promises);
                        });
                        resources_by_id[data_resource.id].lastupdate = data_resource._lastupdate_time;
                    }
                    // no debo esperar a que se resuelvan los include
                    if (include_promises.length === 0) {
                        if (datacollection.page) {
                            collection.page.number = datacollection.page.number;
                        }
                        for (let dataresource of datacollection.data) {
                            /** @type {?} */
                            let resource = resources_by_id[dataresource.id];
                            if (collection.data.indexOf(resource) !== -1) {
                                continue;
                            }
                            collection.data.push(resource);
                        }
                        resolve(null);
                    }
                    else {
                        // esperamos las promesas de los include antes de dar el resolve
                        Promise.all(include_promises)
                            .then(success3 => {
                            if (datacollection.page) {
                                collection.page.number = datacollection.page.number;
                            }
                            for (let dataresource of datacollection.data) {
                                /** @type {?} */
                                let resource = resources_by_id[dataresource.id];
                                collection.data.push(resource);
                            }
                            resolve(null);
                        })
                            .catch(error3 => {
                            reject(error3);
                        });
                    }
                })
                    .catch(err => {
                    reject(err);
                });
            });
            return promise;
        });
    }
    /**
     * @param {?} resource
     * @param {?} resource_alias
     * @param {?} include_promises
     * @return {?}
     */
    fillRelationshipFromStore(resource, resource_alias, include_promises) {
        if (resource_alias.includes('.')) {
            /** @type {?} */
            let included_resource_alias_parts = resource_alias.split('.');
            /** @type {?} */
            let datadocument = resource.relationships[included_resource_alias_parts[0]].data;
            if (datadocument instanceof DocumentResource) {
                return this.fillRelationshipFromStore(datadocument.data, included_resource_alias_parts[1], include_promises);
            }
            else if (datadocument instanceof DocumentCollection) {
                for (let related_resource of datadocument.data) {
                    this.fillRelationshipFromStore(related_resource, included_resource_alias_parts[1], include_promises);
                }
                return;
            }
        }
        if (resource.relationships[resource_alias] instanceof DocumentResource) {
            /** @type {?} */
            let related_resource = /** @type {?} */ (resource.relationships[resource_alias].data);
            if (!('attributes' in related_resource)) {
                /** @type {?} */
                let builded_resource = this.getResourceFromMemory(related_resource);
                if (builded_resource.is_new) {
                    // no está en memoria, la pedimos a store
                    include_promises.push(this.getResource(builded_resource));
                }
                else if (isDevMode()) {
                    console.warn('ts-angular-json: esto no debería pasar #isdjf2l1a');
                }
                resource.addRelationship(builded_resource, resource_alias);
            }
        }
        // else @todo hasMany??
    }
}
//# sourceMappingURL=cachestore.js.map