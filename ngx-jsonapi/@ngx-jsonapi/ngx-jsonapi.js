import { Injectable, NgModule, Optional, SkipSelf, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { catchError, share, tap } from 'rxjs/operators';
import * as localForage from 'localforage';
import { extendPrototype } from 'localforage-getitems';
import { isArray, isObject } from 'util';
import { BehaviorSubject, Subject, noop, of, throwError } from 'rxjs';
import { noop as noop$2 } from 'rxjs/internal/util/noop';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class JsonapiConfig {
    constructor() {
        this.url = '';
        this.params_separator = '?';
        this.unify_concurrency = true;
        this.cache_prerequests = false;
        this.cachestore_support = false;
        this.parameters = {
            page: {
                number: 'page[number]',
                size: 'page[size]'
            }
        };
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Http {
    /**
     * @param {?} http
     * @param {?} rsJsonapiConfig
     */
    constructor(http$$1, rsJsonapiConfig) {
        this.http = http$$1;
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Page {
    constructor() {
        this.number = 1;
        this.total_resources = 0;
        this.size = 0;
        this.resources_per_page = 0;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Document {
    constructor() {
        this.builded = false;
        this.is_loading = true;
        this.source = 'new';
        this.cache_last_update = 0;
        this.meta = {};
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class PathBuilder {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
class DocumentResource extends Document {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ResourceRelationshipsConverter {
    /**
     * @param {?} getService
     * @param {?} relationships_from
     * @param {?} relationships_dest
     * @param {?} included_resources
     */
    constructor(getService, relationships_from, relationships_dest, included_resources) {
        this.getService = getService;
        this.relationships_from = relationships_from;
        this.relationships_dest = relationships_dest;
        this.included_resources = included_resources;
    }
    /**
     * @return {?}
     */
    buildRelationships() {
        // recorro los relationships levanto el service correspondiente
        for (const relation_alias in this.relationships_from) {
            /** @type {?} */
            let relation_from_value = this.relationships_from[relation_alias];
            if (!relation_from_value.data) {
                continue;
            }
            if (this.relationships_dest[relation_alias] instanceof DocumentCollection) {
                this.__buildRelationshipHasMany(relation_from_value, relation_alias);
            }
            else if (this.relationships_dest[relation_alias] instanceof DocumentResource) {
                this.__buildRelationshipHasOne(relation_from_value, relation_alias);
            }
            else {
                // console.warn('Relation', relation_alias, 'dont exists');
            }
        }
    }
    /**
     * @param {?} relation_from_value
     * @param {?} relation_alias
     * @return {?}
     */
    __buildRelationshipHasMany(relation_from_value, relation_alias) {
        /** @type {?} */
        let relation_type = relation_from_value.data[0] ? relation_from_value.data[0].type : '';
        if (relation_type === '') {
            return;
        }
        relation_alias = relation_alias || relation_type;
        if (!this.getService(relation_type)) {
            if (isDevMode()) {
                console.warn('The relationship ' + relation_alias + ' (type', relation_type, ') cant be generated because service for this type has not been injected.');
            }
            return;
        }
        if (relation_from_value.data.length === 0) {
            this.relationships_dest[relation_alias] = new DocumentCollection();
            return;
        }
        (/** @type {?} */ (this.relationships_dest[relation_alias])).fill(relation_from_value, this.included_resources);
    }
    /**
     * @param {?} relation_data_from
     * @param {?} relation_alias
     * @return {?}
     */
    __buildRelationshipHasOne(relation_data_from, relation_alias) {
        // new related resource <> cached related resource <> ? delete!
        if (!('type' in relation_data_from.data)) {
            this.relationships_dest[relation_alias].data = [];
            return;
        }
        if (relation_data_from.data.id !== (/** @type {?} */ (this.relationships_dest[relation_alias].data)).id) {
            this.relationships_dest[relation_alias].data = new Resource();
        }
        if ((/** @type {?} */ (this.relationships_dest[relation_alias].data)).id !== relation_data_from.data.id) {
            /** @type {?} */
            let resource_data = this.__buildRelationship(relation_data_from.data, this.included_resources);
            if (resource_data) {
                this.relationships_dest[relation_alias].data = resource_data;
                this.relationships_dest[relation_alias].builded = true;
            }
        }
    }
    /**
     * @param {?} resource_data_from
     * @param {?} included_array
     * @return {?}
     */
    __buildRelationship(resource_data_from, included_array) {
        if (resource_data_from.type in included_array && resource_data_from.id in included_array[resource_data_from.type]) {
            /** @type {?} */
            let data = included_array[resource_data_from.type][resource_data_from.id];
            // Store the include in cache
            this.getService(resource_data_from.type).cachestore.setResource(data);
            return data;
        }
        else {
            /** @type {?} */
            let service = this.getService(resource_data_from.type);
            if (service && resource_data_from.id in service.cachememory.resources) {
                return service.cachememory.resources[resource_data_from.id];
            }
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Resource {
    constructor() {
        this.id = '';
        this.type = '';
        this.attributes = {};
        this.relationships = {};
        this.relationships_definitions = undefined;
        this.links = {};
        this.is_new = true;
        this.is_saving = false;
        this.is_loading = false;
        this.source = 'new';
        this.cache_last_update = 0;
    }
    /**
     * @return {?}
     */
    reset() {
        this.id = '';
        this.attributes = {};
        this.is_new = true;
        for (const key in this.relationships) {
            this.relationships[key] =
                this.relationships[key] instanceof DocumentCollection ? new DocumentCollection() : new DocumentResource();
        }
    }
    /**
     * @param {?=} params
     * @return {?}
     */
    toObject(params) {
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        let relationships = {};
        /** @type {?} */
        let included = [];
        /** @type {?} */
        let included_ids = []; // just for control don't repeat any resource
        // REALTIONSHIPS
        for (const relation_alias in this.relationships) {
            /** @type {?} */
            let relationship = this.relationships[relation_alias];
            if (relationship instanceof DocumentCollection) {
                // @TODO PABLO: definir cuál va a ser la propiedd indispensable para guardar la relación
                if (!relationship.builded && (!relationship.data || relationship.data.length === 0)) {
                    delete relationships[relation_alias];
                }
                else {
                    relationships[relation_alias] = { data: [] };
                }
                for (const resource of relationship.data) {
                    /** @type {?} */
                    let reational_object = {
                        id: resource.id,
                        type: resource.type
                    };
                    relationships[relation_alias].data.push(reational_object);
                    /** @type {?} */
                    let temporal_id = resource.type + '_' + resource.id;
                    if (included_ids.indexOf(temporal_id) === -1 && params.include.indexOf(relation_alias) !== -1) {
                        included_ids.push(temporal_id);
                        included.push(resource.toObject({}).data);
                    }
                }
            }
            else {
                // @TODO PABLO: agregué el check de null porque sino fallan las demás condiciones, además es para eliminar la relacxión del back
                if (relationship.data === null) {
                    relationships[relation_alias] = { data: null };
                    continue;
                }
                if (!(relationship instanceof DocumentResource)) {
                    console.warn(relationship, ' is not DocumentCollection or DocumentResource');
                }
                /** @type {?} */
                let relationship_data = /** @type {?} */ (relationship.data);
                if (!('id' in relationship.data) && Object.keys(relationship.data).length > 0) {
                    console.warn(relation_alias + ' defined with hasMany:false, but I have a collection');
                }
                if (relationship_data.id && relationship_data.type) {
                    relationships[relation_alias] = {
                        data: {
                            id: relationship_data.id,
                            type: relationship_data.type
                        }
                    };
                    // @TODO PABLO: definir cuál va a ser la propiedd indispensable para guardar la relación
                    // @WARNING: no borrar la verificación de que no sea null... sino no se van a poder borrar
                }
                else if (!relationship.builded && !relationship_data.id && !relationship_data.type) {
                    delete relationships[relation_alias];
                }
                /** @type {?} */
                let temporal_id = relationship_data.type + '_' + relationship_data.id;
                if (included_ids.indexOf(temporal_id) === -1 && params.include.indexOf(relation_alias) !== -1) {
                    included_ids.push(temporal_id);
                    included.push(relationship_data.toObject({}).data);
                }
            }
        }
        /** @type {?} */
        let attributes;
        if (this.getService() && this.getService().parseToServer) {
            attributes = Object.assign({}, this.attributes);
            this.getService().parseToServer(attributes);
        }
        else {
            attributes = this.attributes;
        }
        /** @type {?} */
        let ret = {
            data: {
                type: this.type,
                id: this.id,
                attributes: attributes,
                relationships: relationships
            },
            builded: false,
            content: 'resource'
        };
        if (included.length > 0) {
            ret.included = included;
        }
        return ret;
    }
    /**
     * @param {?} data_object
     * @param {?=} included_resources
     * @return {?}
     */
    fill(data_object, included_resources) {
        included_resources = included_resources || Converter.buildIncluded(data_object);
        this.id = data_object.data.id || '';
        this.attributes = data_object.data.attributes || this.attributes;
        this.data_resource = data_object;
        this.is_new = false;
        /** @type {?} */
        let service = Converter.getService(data_object.data.type);
        // wee need a registered service
        if (!service) {
            return;
        }
        // only ids?
        if (Object.keys(this.attributes).length) {
            Converter.getService(this.type).parseFromServer(this.attributes);
        }
        if (this.relationships_definitions) {
            data_object.data.relationships = this.relationships;
            this.relationships = this.relationships_definitions;
        }
        new ResourceRelationshipsConverter(Converter.getService, data_object.data.relationships || {}, this.relationships, included_resources).buildRelationships();
    }
    /**
     * @template T
     * @param {?} resource
     * @param {?=} type_alias
     * @return {?}
     */
    addRelationship(resource, type_alias) {
        /** @type {?} */
        let relation = this.relationships[type_alias || resource.type];
        if (relation instanceof DocumentCollection) {
            relation.replaceOrAdd(resource);
        }
        else {
            relation.data = resource;
        }
    }
    /**
     * @template R
     * @param {?} resources
     * @param {?} type_alias
     * @return {?}
     */
    addRelationships(resources, type_alias) {
        if (resources.length === 0) {
            return;
        }
        /** @type {?} */
        let relation = this.relationships[type_alias];
        if (!(relation instanceof DocumentCollection)) {
            throw new Error('addRelationships require a DocumentCollection (hasMany) relation.');
        }
        resources.forEach((resource) => {
            this.addRelationship(resource, type_alias);
        });
    }
    /**
     * @deprecated
     * @template R
     * @param {?} resources
     * @param {?} type_alias
     * @return {?}
     */
    addRelationshipsArray(resources, type_alias) {
        this.addRelationships(resources, type_alias);
    }
    /**
     * @param {?} type_alias
     * @param {?} id
     * @return {?}
     */
    removeRelationship(type_alias, id) {
        if (!(type_alias in this.relationships)) {
            return false;
        }
        if (!('data' in this.relationships[type_alias])) {
            return false;
        }
        /** @type {?} */
        let relation = this.relationships[type_alias];
        if (relation instanceof DocumentCollection) {
            relation.data = relation.data.filter(resource => resource.id !== id);
        }
        else {
            relation.data.reset();
        }
        return true;
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    hasManyRelated(resource) {
        return this.relationships[resource] && (/** @type {?} */ (this.relationships[resource].data)).length > 0;
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    hasOneRelated(resource) {
        return (this.relationships[resource] &&
            (/** @type {?} */ (this.relationships[resource].data)).type &&
            (/** @type {?} */ (this.relationships[resource].data)).type !== '');
    }
    /**
     * @return {?}
     */
    getService() {
        return Converter.getService(this.type);
    }
    /**
     * @template T
     * @param {?=} params
     * @return {?}
     */
    save(params) {
        params = Object.assign({}, Base.ParamsResource, params);
        if (this.is_saving || this.is_loading) {
            return of({});
        }
        this.is_saving = true;
        /** @type {?} */
        let subject = new Subject();
        /** @type {?} */
        let object = this.toObject(params);
        if (this.id === '') {
            delete object.data.id;
        }
        /** @type {?} */
        let path = new PathBuilder();
        path.applyParams(this.getService(), params);
        if (this.id) {
            path.appendPath(this.id);
        }
        Core.exec(path.get(), this.id ? 'PATCH' : 'POST', object, true).subscribe(success => {
            this.is_saving = false;
            // foce reload cache (for example, we add a new element)
            if (!this.id) {
                this.getService().cachememory.deprecateCollections(path.get());
                this.getService().cachestore.deprecateCollections(path.get());
            }
            // is a resource?
            if ('id' in success.data) {
                this.id = success.data.id;
                this.fill(/** @type {?} */ (success));
            }
            else if (isArray(success.data)) {
                console.warn('Server return a collection when we save()', success.data);
            }
            subject.next(success);
            subject.complete();
        }, error => {
            this.is_saving = false;
            subject.error('data' in error ? error.data : error);
        });
        return subject;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
class Converter {
    /**
     * @param {?} json_array
     * @return {?}
     */
    static json_array2resources_array_by_type(json_array) {
        /** @type {?} */
        let all_resources = {};
        /** @type {?} */
        let resources_by_type = {};
        Converter.json_array2resources_array(json_array, all_resources);
        for (const key in all_resources) {
            /** @type {?} */
            let resource = all_resources[key];
            if (!(resource.type in resources_by_type)) {
                resources_by_type[resource.type] = {};
            }
            resources_by_type[resource.type][resource.id] = resource;
        }
        return resources_by_type;
    }
    /**
     * @param {?} json_resource
     * @param {?} instance_relationships
     * @return {?}
     */
    static json2resource(json_resource, instance_relationships) {
        /** @type {?} */
        let resource_service = Converter.getService(json_resource.type);
        if (resource_service) {
            return Converter.procreate(json_resource);
        }
        else {
            if (isDevMode()) {
                console.warn('`' + json_resource.type + '`', 'service not found on json2resource().', 'Use @Autoregister() on service and inject it on component.');
            }
            /** @type {?} */
            let temp = new Resource();
            temp.id = json_resource.id;
            temp.type = json_resource.type;
            return temp;
        }
    }
    /**
     * @param {?} type
     * @return {?}
     */
    static getService(type) {
        /** @type {?} */
        let resource_service = Core.me.getResourceService(type);
        return resource_service;
    }
    /**
     * @param {?} document_from
     * @return {?}
     */
    static buildIncluded(document_from) {
        if ('included' in document_from) {
            return Converter.json_array2resources_array_by_type(document_from.included);
        }
        return {};
    }
    /**
     * @param {?} data
     * @return {?}
     */
    static procreate(data) {
        if (!('type' in data && 'id' in data)) {
            console.error('Jsonapi Resource is not correct', data);
        }
        /** @type {?} */
        let resource;
        if (data.id in Converter.getService(data.type).cachememory.resources) {
            resource = Converter.getService(data.type).cachememory.resources[data.id];
        }
        else {
            resource = Converter.getService(data.type).getOrCreateResource(data.id);
        }
        resource.attributes = data.attributes || {};
        resource.relationships_definitions = resource.relationships;
        resource.relationships = /** @type {?} */ (data.relationships);
        resource.is_new = false;
        return resource;
    }
    /**
     * @param {?} json_array
     * @param {?=} destination_array
     * @return {?}
     */
    static json_array2resources_array(json_array, destination_array = {}) {
        for (let data of json_array) {
            /** @type {?} */
            let resource = Converter.json2resource(data, false);
            destination_array[resource.type + '_' + resource.id] = resource;
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
class DocumentCollection extends Document {
    constructor() {
        super(...arguments);
        this.data = [];
        this.page = new Page();
    }
    /**
     * @param {?} iterated_resource
     * @return {?}
     */
    trackBy(iterated_resource) {
        return iterated_resource.id;
    }
    /**
     * @param {?} id
     * @return {?}
     */
    find(id) {
        // this is the best way: https://jsperf.com/fast-array-foreach
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return this.data[i];
            }
        }
        return null;
    }
    /**
     * @param {?} data_collection
     * @param {?=} included_resources
     * @return {?}
     */
    fill(data_collection, included_resources) {
        this.data_collection = data_collection;
        included_resources = included_resources || Converter.buildIncluded(data_collection);
        // sometimes get Cannot set property 'number' of undefined (page)
        if (this.page && data_collection.meta) {
            this.page.number = data_collection.meta["page"] || 1;
            this.page.resources_per_page = data_collection.meta["resources_per_page"] || null; // @deprecated (v2.0.2)
            this.page.size = data_collection.meta["resources_per_page"] || null;
            this.page.total_resources = data_collection.meta["total_resources"] || null;
        }
        /** @type {?} */
        let new_ids = {};
        this.data = [];
        this.builded = data_collection.data && data_collection.data.length === 0;
        for (let dataresource of data_collection.data) {
            /** @type {?} */
            let res = this.find(dataresource.id) || Converter.getService(dataresource.type).getOrCreateResource(dataresource.id);
            res.fill({ data: dataresource }, included_resources); // @todo check with included resources?
            new_ids[dataresource.id] = dataresource.id;
            this.data.push(/** @type {?} */ (res));
            if (Object.keys(res.attributes).length > 0) {
                this.builded = true;
            }
        }
        // remove old members of collection (bug, for example, when request something like orders/10/details and has new ids)
        // @todo test with relation.data.filter(resource =>  resource.id != id );
        for (let i; i < this.data.length; i++) {
            if (!(this.data[i].id in new_ids)) {
                delete this.data[i];
            }
        }
        this.meta = data_collection.meta || {};
    }
    /**
     * @param {?} resource
     * @return {?}
     */
    replaceOrAdd(resource) {
        /** @type {?} */
        let res = this.find(resource.id);
        if (res === null) {
            this.data.push(resource);
        }
        else {
            res = resource;
        }
    }
    /**
     * @return {?}
     */
    hasMorePages() {
        if (this.page.size < 1) {
            return null;
        }
        /** @type {?} */
        let total_resources = this.page.size * (this.page.number - 1) + this.data.length;
        return total_resources < this.page.total_resources;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Base {
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

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
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
extendPrototype(localForage);
/**
 * @record
 */
function IStoreElement() { }
/** @type {?} */
IStoreElement.prototype.time;
/**
 * @record
 */
function IDataResourceStorage() { }
/** @type {?} */
IDataResourceStorage.prototype._lastupdate_time;
/**
 * @record
 */
function IDataCollectionStorage() { }
/** @type {?} */
IDataCollectionStorage.prototype._lastupdate_time;
class StoreService {
    constructor() {
        if (this.globalstore)
            this.checkIfIsTimeToClean();
    }
    /**
     * @param {?} type
     * @param {?} id_or_url
     * @return {?}
     */
    getDataObject(type, id_or_url) {
        /** @type {?} */
        let subject = new Subject();
        this.allstore
            .getItem('jsonapi.' + type + '.' + id_or_url)
            .then(success => {
            if (success === null) {
                subject.error(null);
            }
            else {
                subject.next(success);
            }
            subject.complete();
        })
            .catch(error => subject.next(error));
        return subject.asObservable();
    }
    /**
     * @param {?} keys
     * @return {?}
     */
    getDataResources(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.allstore.getItems(keys.map(key => 'jsonapi.' + key));
        });
    }
    /**
     * @param {?} type
     * @param {?} url_or_id
     * @param {?} value
     * @return {?}
     */
    saveResource(type, url_or_id, value) {
        /** @type {?} */
        let data_resource_storage = Object.assign({ _lastupdate_time: Date.now() }, value);
        this.allstore.setItem('jsonapi.' + type + '.' + url_or_id, data_resource_storage);
    }
    /**
     * @param {?} url_or_id
     * @param {?} value
     * @return {?}
     */
    saveCollection(url_or_id, value) {
        /** @type {?} */
        let data_collection_storage = Object.assign({ _lastupdate_time: Date.now() }, value);
        this.allstore.setItem('jsonapi.collection.' + url_or_id, data_collection_storage);
    }
    /**
     * @return {?}
     */
    clearCache() {
        this.allstore.clear();
        this.globalstore.clear();
    }
    /**
     * @param {?} key_start_with
     * @return {?}
     */
    deprecateObjectsWithKey(key_start_with) {
        this.allstore
            .keys()
            .then(success => {
            Base.forEach(success, (key) => {
                if (key.startsWith(key_start_with)) {
                    // key of stored object starts with key_start_with
                    this.allstore
                        .getItem(key)
                        .then((success2) => {
                        success2._lastupdate_time = 0;
                        this.allstore.setItem(key, success2);
                    })
                        .catch(noop);
                }
            });
        })
            .catch(noop);
    }
    /**
     * @return {?}
     */
    checkIfIsTimeToClean() {
        // check if is time to check cachestore
        this.globalstore
            .getItem('_lastclean_time')
            .then((success) => {
            if (Date.now() >= success.time + 12 * 3600 * 1000) {
                // is time to check cachestore!
                this.globalstore.setItem('_lastclean_time', {
                    time: Date.now()
                });
                this.checkAndDeleteOldElements();
            }
        })
            .catch(() => {
            this.globalstore.setItem('_lastclean_time', {
                time: Date.now()
            });
        });
    }
    /**
     * @return {?}
     */
    checkAndDeleteOldElements() {
        this.allstore
            .keys()
            .then(success => {
            Base.forEach(success, key => {
                // recorremos cada item y vemos si es tiempo de removerlo
                this.allstore
                    .getItem(key)
                    .then((success2) => {
                    if (Date.now() >= success2._lastupdate_time + 24 * 3600 * 1000) {
                        this.allstore.removeItem(key);
                    }
                })
                    .catch(noop);
            });
        })
            .catch(noop);
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Core {
    /**
     * @param {?} user_config
     * @param {?} jsonapiStoreService
     * @param {?} jsonapiHttp
     */
    constructor(user_config, jsonapiStoreService, jsonapiHttp) {
        this.loadingsCounter = 0;
        this.loadingsStart = noop$2;
        this.loadingsDone = noop$2;
        this.loadingsError = noop$2;
        this.loadingsOffline = noop$2;
        this.resourceServices = {};
        this.config = new JsonapiConfig();
        for (let k in this.config) {
            (/** @type {?} */ (this.config))[k] = user_config[k] !== undefined ? user_config[k] : (/** @type {?} */ (this.config))[k];
        }
        Core.me = this;
        Core.injectedServices = {
            JsonapiStoreService: jsonapiStoreService,
            JsonapiHttp: jsonapiHttp,
            rsJsonapiConfig: this.config
        };
    }
    /**
     * @param {?} path
     * @return {?}
     */
    static delete(path) {
        return Core.exec(path, 'DELETE');
    }
    /**
     * @param {?} path
     * @return {?}
     */
    static get(path) {
        return Core.exec(path, 'get');
    }
    /**
     * @param {?} path
     * @param {?} method
     * @param {?=} data
     * @param {?=} call_loadings_error
     * @return {?}
     */
    static exec(path, method, data, call_loadings_error = true) {
        Core.me.refreshLoadings(1);
        return Core.injectedServices.JsonapiHttp.exec(path, method, data).pipe(
        // map(data => { return data.body }),
        tap(() => Core.me.refreshLoadings(-1)), catchError(error => {
            error = error.error || error;
            Core.me.refreshLoadings(-1);
            if (error.status <= 0) {
                // offline?
                if (!Core.me.loadingsOffline(error) && isDevMode()) {
                    console.warn('Jsonapi.Http.exec (use JsonapiCore.loadingsOffline for catch it) error =>', error);
                }
            }
            else if (call_loadings_error && !Core.me.loadingsError(error) && isDevMode()) {
                console.warn('Jsonapi.Http.exec (use JsonapiCore.loadingsError for catch it) error =>', error);
            }
            return throwError(error);
        }));
    }
    /**
     * @template R
     * @param {?} clase
     * @return {?}
     */
    registerService(clase) {
        if (clase.type in this.resourceServices) {
            return false;
        }
        this.resourceServices[clase.type] = clase;
        return /** @type {?} */ (clase);
    }
    /**
     * @param {?} type
     * @return {?}
     */
    getResourceService(type) {
        return this.resourceServices[type];
    }
    /**
     * @param {?} factor
     * @return {?}
     */
    refreshLoadings(factor) {
        this.loadingsCounter += factor;
        if (this.loadingsCounter === 0) {
            this.loadingsDone();
        }
        else if (this.loadingsCounter === 1) {
            this.loadingsStart();
        }
    }
    /**
     * @return {?}
     */
    clearCache() {
        Core.injectedServices.JsonapiStoreService.clearCache();
        return true;
    }
    /**
     * @template R
     * @param {?} resource
     * @param {...?} relations_alias_to_duplicate_too
     * @return {?}
     */
    duplicateResource(resource, ...relations_alias_to_duplicate_too) {
        /** @type {?} */
        let newresource = /** @type {?} */ (this.getResourceService(resource.type).new());
        newresource.attributes = Object.assign({}, newresource.attributes, resource.attributes);
        for (const alias in resource.relationships) {
            /** @type {?} */
            let relationship = resource.relationships[alias];
            if ('id' in relationship.data) {
                // relation hasOne
                if (relations_alias_to_duplicate_too.indexOf(alias) > -1) {
                    newresource.addRelationship(this.duplicateResource(/** @type {?} */ (relationship.data)), alias);
                }
                else {
                    newresource.addRelationship(/** @type {?} */ (relationship.data), alias);
                }
            }
            else {
                // relation hasMany
                if (relations_alias_to_duplicate_too.indexOf(alias) > -1) {
                    Object.values(relationship.data).forEach(relationresource => {
                        newresource.addRelationship(this.duplicateResource(/** @type {?} */ (relationresource)), alias);
                    });
                }
                else {
                    newresource.addRelationships(/** @type {?} */ (relationship.data), alias);
                }
            }
        }
        return newresource;
    }
}
Core.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Core.ctorParameters = () => [
    { type: JsonapiConfig, decorators: [{ type: Optional }] },
    { type: StoreService },
    { type: Http }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxJsonapiModule {
    /**
     * @param {?} parentModule
     * @param {?} jsonapiCore
     */
    constructor(parentModule, jsonapiCore) {
        if (parentModule) {
            throw new Error('NgxJsonapiModule is already loaded. Import it in the AppModule only');
        }
    }
    /**
     * @param {?} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: NgxJsonapiModule,
            providers: [{ provide: JsonapiConfig, useValue: config }]
        };
    }
}
NgxJsonapiModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                exports: [
                    HttpClientModule
                ],
                providers: [
                    Core,
                    StoreService,
                    JsonapiConfig,
                    Http
                ]
            },] },
];
/** @nocollapse */
NgxJsonapiModule.ctorParameters = () => [
    { type: NgxJsonapiModule, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: Core }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @return {?}
 */
function Autoregister() {
    return (target) => {
        /** @type {?} */
        const original = target;
        /** @type {?} */
        const newConstructor = function newCtor(...args) {
            /** @type {?} */
            const c = function childConstuctor() {
                return original.apply(this, arguments);
            };
            c.prototype = Object.create(original.prototype);
            /** @type {?} */
            const instance = new c(...args);
            instance.register();
            return instance;
        };
        newConstructor.prototype = Object.create(target.prototype);
        return newConstructor;
    };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
class CacheMemory {
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

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
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
class CacheStore {
    /**
     * @param {?} resource
     * @param {?=} include
     * @return {?}
     */
    getResource(resource, include = []) {
        return __awaiter$1(this, void 0, void 0, function* () {
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
        return __awaiter$1(this, void 0, void 0, function* () {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} cacheable
 * @param {?=} ttl
 * @return {?}
 */
function isLive(cacheable, ttl = null) {
    return Date.now() <= cacheable.cache_last_update + (ttl || cacheable.ttl || 0) * 1000;
}
/**
 * @param {?} document
 * @return {?}
 */

/**
 * @param {?} document
 * @return {?}
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class UrlParamsBuilder {
    /**
     * @param {?} params
     * @return {?}
     */
    toparams(params) {
        /** @type {?} */
        let ret = '';
        Base.forEach(params, (value, key) => {
            ret += this.toparamsarray(value, '&' + key);
        });
        return ret.slice(1);
    }
    /**
     * @param {?} params
     * @param {?} add
     * @return {?}
     */
    toparamsarray(params, add) {
        /** @type {?} */
        let ret = '';
        if (Array.isArray(params) || isObject(params)) {
            Base.forEach(params, (value, key) => {
                ret += this.toparamsarray(value, add + '[' + key + ']');
            });
        }
        else {
            ret += add + '=' + params;
        }
        return ret;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class PathCollectionBuilder extends PathBuilder {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
class Service {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/* tslint:disable:file-name-casing */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { Autoregister, Core as JsonapiCore, Resource, DocumentResource, DocumentCollection, Service, NgxJsonapiModule, Document as ɵd, JsonapiConfig as ɵa, Http as ɵc, StoreService as ɵb };
//# sourceMappingURL=ngx-jsonapi.js.map
