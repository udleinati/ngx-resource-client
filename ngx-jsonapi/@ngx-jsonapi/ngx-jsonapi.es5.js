var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Inject, Injectable, NgModule, Optional, PLATFORM_ID, SkipSelf, isDevMode } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { isArray, isObject } from 'util';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import Dexie from 'dexie';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { catchError, map, share, tap } from 'rxjs/operators';
import { noop as noop$1 } from 'rxjs/internal/util/noop';
import { cloneDeep, isEqual } from 'lodash';
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Page = /** @class */ (function () {
    function Page() {
        this.number = 1;
        this.total_resources = 0;
        this.size = 0;
        this.resources_per_page = 0;
    }
    return Page;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var CacheableHelper = /** @class */ (function () {
    function CacheableHelper() {
    }
    /**
     * @param {?} relationships
     * @param {?} value
     * @return {?}
     */
    CacheableHelper.propagateLoaded = function (relationships, value) {
        for (var relationship_alias in relationships) {
            /** @type {?} */
            var relationship = relationships[relationship_alias];
            if (relationship instanceof DocumentCollection) {
                // we need to add builded, becuase we dont save objects with content='ids'.
                // these relationships are broken (without any data on data)
                relationship.setLoaded(value && relationship.builded);
            }
        }
    };
    return CacheableHelper;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} params
 * @return {?}
 */
function implementsIParamsResource(params) {
    return (( /** @type {?} */(params)).id !== undefined ||
        ( /** @type {?} */(params)).include_get !== undefined ||
        ( /** @type {?} */(params)).include_save !== undefined);
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var PathBuilder = /** @class */ (function () {
    function PathBuilder() {
        this.paths = [];
        this.includes = [];
        this.get_params = [];
    }
    /**
     * @param {?} service
     * @param {?=} params
     * @return {?}
     */
    PathBuilder.prototype.applyParams = function (service, params) {
        if (params === void 0) { params = {}; }
        this.appendPath(service.getPrePath());
        if (params.beforepath) {
            this.appendPath(params.beforepath);
        }
        this.appendPath(service.getPath());
        if (params.include) {
            this.setInclude(params.include);
        }
        if (implementsIParamsResource(params) && params.include_get) {
            this.setInclude(this.includes.concat(params.include_get));
        }
        if (params.fields && Object.keys(params.fields).length > 0) {
            for (var resource_type in params.fields) {
                /** @type {?} */
                var fields_param = "fields[" + resource_type + "]=" + params.fields[resource_type].join(',');
                this.get_params.push(fields_param);
            }
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    PathBuilder.prototype.appendPath = function (value) {
        if (value !== '') {
            this.paths.push(value);
        }
    };
    /**
     * @return {?}
     */
    PathBuilder.prototype.getForCache = function () {
        return this.paths.join('/') + this.get_params.join('/');
    };
    /**
     * @return {?}
     */
    PathBuilder.prototype.get = function () {
        /** @type {?} */
        var params = this.get_params.slice();
        if (this.includes.length > 0) {
            params.push('include=' + this.includes.join(','));
        }
        return this.paths.join('/') + (params.length > 0 ? Core.injectedServices.rsJsonapiConfig.params_separator + params.join('&') : '');
    };
    /**
     * @param {?} strings_array
     * @return {?}
     */
    PathBuilder.prototype.setInclude = function (strings_array) {
        this.includes = strings_array;
    };
    return PathBuilder;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
var Converter = /** @class */ (function () {
    function Converter() {
    }
    /**
     * @param {?} json_array
     * @return {?}
     */
    Converter.json_array2resources_array_by_type = function (json_array) {
        /** @type {?} */
        var all_resources = {};
        /** @type {?} */
        var resources_by_type = {};
        Converter.json_array2resources_array(json_array, all_resources);
        for (var key in all_resources) {
            /** @type {?} */
            var resource = all_resources[key];
            if (!(resource.type in resources_by_type)) {
                resources_by_type[resource.type] = {};
            }
            resources_by_type[resource.type][resource.id] = resource;
        }
        return resources_by_type;
    };
    /**
     * @param {?} json_resource
     * @param {?} instance_relationships
     * @return {?}
     */
    Converter.json2resource = function (json_resource, instance_relationships) {
        /** @type {?} */
        var resource_service = Converter.getService(json_resource.type);
        if (resource_service) {
            return Converter.procreate(json_resource);
        }
        else {
            if (isDevMode()) {
                console.warn('`' + json_resource.type + '`', 'service not found on json2resource().', 'Use @Autoregister() on service and inject it on component.');
            }
            /** @type {?} */
            var temp = new Resource();
            temp.id = json_resource.id;
            temp.type = json_resource.type;
            return temp;
        }
    };
    /**
     * @param {?} type
     * @return {?}
     */
    Converter.getService = function (type) {
        /** @type {?} */
        var resource_service = Core.me.getResourceService(type);
        return resource_service;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    Converter.getServiceOrFail = function (type) {
        /** @type {?} */
        var resource_service = Core.me.getResourceServiceOrFail(type);
        return resource_service;
    };
    /**
     * @param {?} document_from
     * @return {?}
     */
    Converter.buildIncluded = function (document_from) {
        if ('included' in document_from && document_from.included) {
            return Converter.json_array2resources_array_by_type(document_from.included);
        }
        return {};
    };
    /**
     * @param {?} data
     * @return {?}
     */
    Converter.procreate = function (data) {
        if (!('type' in data && 'id' in data)) {
            console.error('Jsonapi Resource is not correct', data);
        }
        /** @type {?} */
        var resource = CacheMemory.getInstance().getOrCreateResource(data.type, data.id);
        resource.fill({ data: data });
        resource.is_new = false;
        return resource;
    };
    /**
     * @param {?} json_array
     * @param {?=} destination_array
     * @return {?}
     */
    Converter.json_array2resources_array = function (json_array, destination_array) {
        if (destination_array === void 0) { destination_array = {}; }
        for (var _i = 0, json_array_1 = json_array; _i < json_array_1.length; _i++) {
            var data = json_array_1[_i];
            /** @type {?} */
            var resource = Converter.json2resource(data, false);
            destination_array[resource.type + '_' + resource.id] = resource;
        }
    };
    return Converter;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ResourceRelationshipsConverter = /** @class */ (function () {
    /**
     * @param {?} getService
     * @param {?} relationships_from
     * @param {?} relationships_dest
     * @param {?} included_resources
     */
    function ResourceRelationshipsConverter(getService, relationships_from, relationships_dest, included_resources) {
        this.getService = getService;
        this.relationships_from = relationships_from;
        this.relationships_dest = relationships_dest;
        this.included_resources = included_resources;
    }
    /**
     * @return {?}
     */
    ResourceRelationshipsConverter.prototype.buildRelationships = function () {
        // recorro los relationships levanto el service correspondiente
        for (var relation_alias in this.relationships_from) {
            /** @type {?} */
            var relation_from_value = this.relationships_from[relation_alias];
            if (this.relationships_dest[relation_alias] && relation_from_value.data === null) {
                // TODO: FE-92 --- check and improve conditions when building has-one relationships
                this.relationships_dest[relation_alias].data = null;
                this.relationships_dest[relation_alias].builded = true;
                // tslint:disable-next-line:deprecation
                this.relationships_dest[relation_alias].is_loading = false;
                this.relationships_dest[relation_alias].loaded = true;
            }
            if (!relation_from_value.data) {
                continue;
            }
            if (this.relationships_dest[relation_alias] instanceof DocumentCollection) {
                this.__buildRelationshipHasMany(relation_from_value, relation_alias);
            }
            else if (this.relationships_dest[relation_alias] instanceof DocumentResource) {
                this.__buildRelationshipHasOne(relation_from_value, relation_alias);
                // } else if (isDevMode()) {
                //    console.warn(`Relation ${relation_alias} received, but doesn't exist on schema.`);
            }
        }
    };
    /**
     * @param {?} relation_from_value
     * @param {?} relation_alias
     * @return {?}
     */
    ResourceRelationshipsConverter.prototype.__buildRelationshipHasMany = function (relation_from_value, relation_alias) {
        if (relation_from_value.data.length === 0) {
            this.relationships_dest[relation_alias] = new DocumentCollection();
            this.relationships_dest[relation_alias].builded = true;
            return;
        }
        ( /** @type {?} */(this.relationships_dest[relation_alias])).fill(relation_from_value);
    };
    /**
     * @param {?} relation_data_from
     * @param {?} relation_alias
     * @return {?}
     */
    ResourceRelationshipsConverter.prototype.__buildRelationshipHasOne = function (relation_data_from, relation_alias) {
        // new related resource <> cached related resource <> ? delete!
        if (!('type' in relation_data_from.data)) {
            this.relationships_dest[relation_alias].data = [];
            return;
        }
        // TODO: FE-92 --- this.is a hotfix... check and improve conditions when building has-one relationships
        if (!this.relationships_dest[relation_alias].data) {
            this.relationships_dest[relation_alias].data = new Resource();
        }
        if (relation_data_from.data.id !== ( /** @type {?} */(this.relationships_dest[relation_alias].data)).id) {
            this.relationships_dest[relation_alias].data = new Resource();
            // with this, fromServer dont fill relationship
            // (<Resource>this.relationships_dest[relation_alias].data).id = relation_data_from.data.id;
            ( /** @type {?} */(this.relationships_dest[relation_alias].data)).type = relation_data_from.data.type;
        }
        if (( /** @type {?} */(this.relationships_dest[relation_alias].data)).id !== relation_data_from.data.id ||
            !( /** @type {?} */(this.relationships_dest[relation_alias].data)).attributes ||
            Object.keys(( /** @type {?} */(this.relationships_dest[relation_alias].data)).attributes).length === 0) {
            /** @type {?} */
            var resource_data = this.__buildRelationship(relation_data_from.data);
            if (resource_data) {
                this.relationships_dest[relation_alias].data = resource_data;
                this.relationships_dest[relation_alias].builded = true;
            }
            else {
                // NOTE: HOTFIX para cachestore, no es el lugar correcto pero no había otra forma... me parece que hay que refactorizar...
                ( /** @type {?} */(this.relationships_dest[relation_alias].data)).id = relation_data_from.data.id;
                ( /** @type {?} */(this.relationships_dest[relation_alias].data)).type = relation_data_from.data.type;
            }
        }
    };
    /**
     * @param {?} resource_data_from
     * @return {?}
     */
    ResourceRelationshipsConverter.prototype.__buildRelationship = function (resource_data_from) {
        if (resource_data_from.type in this.included_resources &&
            resource_data_from.id in this.included_resources[resource_data_from.type]) {
            /** @type {?} */
            var data = this.included_resources[resource_data_from.type][resource_data_from.id];
            // Store the include in cache
            CacheMemory.getInstance().setResource(data, true);
            // this.getService(resource_data_from.type).cachestore.setResource(data);
            return data;
        }
        else {
            /** @type {?} */
            var service = this.getService(resource_data_from.type);
            /** @type {?} */
            var resource = CacheMemory.getInstance().getResource(resource_data_from.type, resource_data_from.id);
            if (resource) {
                return resource;
            }
        }
    };
    return ResourceRelationshipsConverter;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Resource = /** @class */ (function () {
    function Resource() {
        this.id = '';
        this.type = '';
        this.attributes = {};
        this.relationships = {};
        this.links = {};
        this.is_new = true;
        this.is_saving = false;
        this.is_loading = false;
        this.loaded = true;
        this.source = 'new';
        this.cache_last_update = 0;
        this.ttl = 0;
    }
    /**
     * @return {?}
     */
    Resource.prototype.reset = function () {
        this.id = '';
        this.attributes = {};
        this.is_new = true;
        for (var key in this.relationships) {
            this.relationships[key] =
                this.relationships[key] instanceof DocumentCollection ? new DocumentCollection() : new DocumentResource();
        }
    };
    /**
     * @param {?=} params
     * @return {?}
     */
    Resource.prototype.toObject = function (params) {
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        var relationships = {};
        /** @type {?} */
        var included = [];
        /** @type {?} */
        var included_ids = [];
        /** @type {?} */
        var included_relationships = params.include || [];
        if (params.include_save) {
            included_relationships = included_relationships.concat(params.include_save);
        }
        // REALTIONSHIPS
        for (var relation_alias in this.relationships) {
            /** @type {?} */
            var relationship = this.relationships[relation_alias];
            if (relationship instanceof DocumentCollection) {
                // @TODO PABLO: definir cuál va a ser la propiedd indispensable para guardar la relación
                if (!relationship.builded && (!relationship.data || relationship.data.length === 0)) {
                    delete relationships[relation_alias];
                }
                else {
                    relationships[relation_alias] = { data: [] };
                }
                for (var _i = 0, _a = relationship.data; _i < _a.length; _i++) {
                    var resource = _a[_i];
                    /** @type {?} */
                    var reational_object = {
                        id: resource.id,
                        type: resource.type
                    };
                    relationships[relation_alias].data.push(reational_object);
                    /** @type {?} */
                    var temporal_id = resource.type + '_' + resource.id;
                    if (included_ids.indexOf(temporal_id) === -1 &&
                        included_relationships &&
                        included_relationships.indexOf(relation_alias) !== -1) {
                        included_ids.push(temporal_id);
                        included.push(resource.toObject({}).data);
                    }
                }
            }
            else {
                // @TODO PABLO: agregué el check de null porque sino fallan las demás condiciones, además es para eliminar la relacxión del back
                if (relationship.data === null || relationship.data === undefined) {
                    relationships[relation_alias] = { data: relationship.data };
                    continue;
                }
                if (!(relationship instanceof DocumentResource)) {
                    console.warn(relationship, ' is not DocumentCollection or DocumentResource');
                }
                /** @type {?} */
                var relationship_data = /** @type {?} */ (relationship.data);
                if (relationship.data && !('id' in relationship.data) && Object.keys(relationship.data).length > 0) {
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
                    continue;
                }
                /** @type {?} */
                var temporal_id = relationship_data.type + '_' + relationship_data.id;
                if (included_ids.indexOf(temporal_id) === -1 &&
                    included_relationships &&
                    included_relationships.indexOf(relation_alias) !== -1) {
                    included_ids.push(temporal_id);
                    included.push(relationship_data.toObject({}).data);
                }
            }
        }
        /** @type {?} */
        var attributes;
        if (this.getService() && this.getService().parseToServer) {
            attributes = Object.assign({}, this.attributes);
            this.getService().parseToServer(attributes);
        }
        else {
            attributes = this.attributes;
        }
        /** @type {?} */
        var ret = {
            data: {
                type: this.type,
                id: this.id,
                attributes: attributes,
                relationships: relationships
            }
        };
        // resource's meta
        if (this.meta) {
            ret.data.meta = this.meta;
        }
        // top level meta
        if (params.meta) {
            ret.meta = params.meta;
        }
        if (included.length > 0) {
            ret.included = included;
        }
        return ret;
    };
    /**
     * @param {?} data_object
     * @return {?}
     */
    Resource.prototype.fill = function (data_object) {
        this.id = data_object.data.id || '';
        // WARNING: leaving previous line for a tiem because this can produce undesired behavior
        // this.attributes = data_object.data.attributes || this.attributes;
        this.attributes = Object.assign({}, (this.attributes || {}), data_object.data.attributes);
        this.data_resource = data_object;
        this.is_new = false;
        /** @type {?} */
        var service = Converter.getService(data_object.data.type);
        if (!this.relationships && service) {
            this.relationships = new service.resource().relationships;
        }
        // wee need a registered service
        if (!service) {
            return false;
        }
        // only ids?
        if (Object.keys(this.attributes).length) {
            /** @type {?} */
            var srvc = Converter.getService(this.type);
            if (srvc && 'parseFromServer' in srvc) {
                srvc.parseFromServer(this.attributes);
            }
        }
        if ('cache_last_update' in data_object.data) {
            this.cache_last_update = data_object.data.cache_last_update;
        }
        new ResourceRelationshipsConverter(Converter.getService, data_object.data.relationships || {}, this.relationships, Converter.buildIncluded(data_object)).buildRelationships();
        return true;
    };
    /**
     * @template T
     * @param {?} resource
     * @param {?=} type_alias
     * @return {?}
     */
    Resource.prototype.addRelationship = function (resource, type_alias) {
        /** @type {?} */
        var relation = this.relationships[type_alias || resource.type];
        if (relation instanceof DocumentCollection) {
            relation.replaceOrAdd(resource);
        }
        else {
            relation.data = resource;
        }
    };
    /**
     * @template R
     * @param {?} resources
     * @param {?} type_alias
     * @return {?}
     */
    Resource.prototype.addRelationships = function (resources, type_alias) {
        var _this = this;
        if (resources.length === 0) {
            return;
        }
        /** @type {?} */
        var relation = this.relationships[type_alias];
        if (!(relation instanceof DocumentCollection)) {
            throw new Error('addRelationships require a DocumentCollection (hasMany) relation.');
        }
        resources.forEach(function (resource) {
            _this.addRelationship(resource, type_alias);
        });
    };
    /**
     * @param {?} type_alias
     * @param {?} id
     * @return {?}
     */
    Resource.prototype.removeRelationship = function (type_alias, id) {
        if (!(type_alias in this.relationships)) {
            return false;
        }
        if (!('data' in this.relationships[type_alias])) {
            return false;
        }
        /** @type {?} */
        var relation = this.relationships[type_alias];
        if (relation instanceof DocumentCollection) {
            relation.data = relation.data.filter(function (resource) { return resource.id !== id; });
            if (relation.data.length === 0) {
                // used by toObject() when hasMany is empty
                relation.builded = true;
            }
        }
        else {
            relation.data = null;
        }
        return true;
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    Resource.prototype.hasManyRelated = function (resource) {
        return this.relationships[resource] && ( /** @type {?} */(this.relationships[resource].data)).length > 0;
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    Resource.prototype.hasOneRelated = function (resource) {
        return Boolean(this.relationships[resource] &&
            ( /** @type {?} */(this.relationships[resource].data)).type &&
            ( /** @type {?} */(this.relationships[resource].data)).type !== '');
    };
    /**
     * @template T
     * @param {?=} params
     * @return {?}
     */
    Resource.prototype.restore = function (params) {
        if (params === void 0) { params = {}; }
        params.meta = Object.assign({}, params.meta, { restore: true });
        return this.save(params);
    };
    /**
     * @return {?}
     */
    Resource.prototype.getService = function () {
        return Converter.getServiceOrFail(this.type);
    };
    /**
     * @return {?}
     */
    Resource.prototype.delete = function () {
        return this.getService().delete(this.id);
    };
    /**
     * @template T
     * @param {?=} params
     * @return {?}
     */
    Resource.prototype.save = function (params) {
        var _this = this;
        params = Object.assign({}, Base.ParamsResource, params);
        if (this.is_saving || !this.loaded) {
            return of({});
        }
        this.is_saving = true;
        /** @type {?} */
        var subject = new Subject();
        /** @type {?} */
        var object = this.toObject(params);
        if (this.id === '') {
            delete object.data.id;
        }
        /** @type {?} */
        var path = new PathBuilder();
        path.applyParams(this.getService(), params);
        if (this.id) {
            path.appendPath(this.id);
        }
        Core.exec(path.get(), this.is_new ? 'POST' : 'PATCH', object, true).subscribe(function (success) {
            _this.is_saving = false;
            // force reload collections cache (example: we add a new element)
            if (!_this.id) {
                CacheMemory.getInstance().deprecateCollections(path.get());
                /** @type {?} */
                var jsonripper = new JsonRipper();
                jsonripper.deprecateCollection(path.get());
            }
            // is a resource?
            if ('id' in success.data) {
                _this.id = success.data.id;
                _this.fill(/** @type {?} */ (success));
            }
            else if (isArray(success.data)) {
                console.warn('Server return a collection when we save()', success.data);
            }
            subject.next(success);
            subject.complete();
        }, function (error) {
            _this.is_saving = false;
            subject.error('data' in error ? error.data : error);
        });
        return subject.asObservable();
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Resource.prototype.setLoaded = function (value) {
        // tslint:disable-next-line:deprecation
        this.is_loading = !value;
        this.loaded = value;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Resource.prototype.setLoadedAndPropagate = function (value) {
        this.setLoaded(value);
        CacheableHelper.propagateLoaded(this.relationships, value);
    };
    /**
     * \@todo generate interface
     * @param {?} value
     * @return {?}
     */
    Resource.prototype.setSource = function (value) {
        this.source = value;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    Resource.prototype.setSourceAndPropagate = function (value) {
        this.setSource(value);
        for (var relationship_alias in this.relationships) {
            /** @type {?} */
            var relationship = this.relationships[relationship_alias];
            if (relationship instanceof DocumentCollection) {
                relationship.setSource(value);
            }
        }
    };
    /**
     * @param {?=} value
     * @return {?}
     */
    Resource.prototype.setCacheLastUpdate = function (value) {
        if (value === void 0) { value = Date.now(); }
        this.cache_last_update = value;
    };
    return Resource;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @typedef {?} */
/**
 * @record
 */
function IDocumentHasIds() { }
/** @type {?} */
IDocumentHasIds.prototype.data;
/** @type {?} */
IDocumentHasIds.prototype.content;
/**
 * @record
 */
function IDocumentHasResources() { }
/** @type {?} */
IDocumentHasResources.prototype.data;
/** @type {?} */
IDocumentHasResources.prototype.content;
/**
 * @record
 */
function IDocumentHasId() { }
/** @type {?} */
IDocumentHasId.prototype.data;
/** @type {?} */
IDocumentHasId.prototype.content;
/**
 * @record
 */
function IDocumentHasResource() { }
/** @type {?} */
IDocumentHasResource.prototype.data;
/** @type {?} */
IDocumentHasResource.prototype.content;
var Document = /** @class */ (function () {
    function Document() {
        this.builded = false;
        this.is_loading = true;
        this.loaded = false;
        this.source = 'new';
        this.cache_last_update = 0;
        this.meta = {};
    }
    return Document;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
var RelatedDocumentCollection = /** @class */ (function (_super) {
    __extends(RelatedDocumentCollection, _super);
    function RelatedDocumentCollection() {
        var _this = _super.apply(this, arguments) || this;
        _this.data = [];
        _this.page = new Page();
        _this.ttl = 0;
        _this.content = 'ids';
        return _this;
    }
    /**
     * @param {?} iterated_resource
     * @return {?}
     */
    RelatedDocumentCollection.prototype.trackBy = function (iterated_resource) {
        return iterated_resource.id;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    RelatedDocumentCollection.prototype.find = function (id) {
        if (this.content === 'ids') {
            return null;
        }
        // this is the best way: https://jsperf.com/fast-array-foreach
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return /** @type {?} */ (this.data[i]);
            }
        }
        return null;
    };
    /**
     * @param {?} data_collection
     * @return {?}
     */
    RelatedDocumentCollection.prototype.fill = function (data_collection) {
        this.data_collection = data_collection;
        Converter.buildIncluded(data_collection);
        // sometimes get Cannot set property 'number' of undefined (page)
        if (this.page && data_collection.meta) {
            this.page.number = data_collection.meta["page"] || 1;
            this.page.resources_per_page = data_collection.meta["resources_per_page"] || null; // @deprecated (v2.0.2)
            this.page.size = data_collection.meta["resources_per_page"] || null;
            this.page.total_resources = data_collection.meta["total_resources"] || null;
        }
        /** @type {?} */
        var new_ids = {};
        this.data.length = 0;
        this.builded = data_collection.data && data_collection.data.length === 0;
        for (var _i = 0, _a = data_collection.data; _i < _a.length; _i++) {
            var dataresource = _a[_i];
            try {
                /** @type {?} */
                var res = this.getResourceOrFail(dataresource);
                res.fill({ data: dataresource });
                new_ids[dataresource.id] = dataresource.id;
                ( /** @type {?} */(this.data)).push(/** @type {?} */ (res));
                if (Object.keys(res.attributes).length > 0) {
                    this.builded = true;
                }
            }
            catch (error) {
                this.content = 'ids';
                this.builded = false;
                this.data.push({ id: dataresource.id, type: dataresource.type });
            }
        }
        // remove old members of collection (bug, for example, when request something like orders/10/details and has new ids)
        // @todo test with relation.data.filter(resource =>  resource.id != id );
        for (var i = void 0; i < this.data.length; i++) {
            if (!(this.data[i].id in new_ids)) {
                delete this.data[i];
            }
        }
        this.meta = data_collection.meta || {};
        if ('cache_last_update' in data_collection) {
            this.cache_last_update = data_collection.cache_last_update;
        }
    };
    /**
     * @param {?} dataresource
     * @return {?}
     */
    RelatedDocumentCollection.prototype.getResourceOrFail = function (dataresource) {
        /** @type {?} */
        var res = this.find(dataresource.id);
        if (res !== null) {
            return res;
        }
        /** @type {?} */
        var service = Converter.getService(dataresource.type);
        // remove when getService return null or catch errors
        // this prvent a fill on undefinied service :/
        if (!service) {
            if (isDevMode()) {
                console.warn('The relationship ' +
                    'relation_alias?' +
                    ' (type ' +
                    dataresource.type +
                    ') cant be generated because service for this type has not been injected.');
            }
            throw new Error('Cant create service for ' + dataresource.type);
        }
        // END remove when getService return null or catch errors
        return service.getOrCreateResource(dataresource.id);
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    RelatedDocumentCollection.prototype.replaceOrAdd = function (resource) {
        /** @type {?} */
        var res = this.find(resource.id);
        if (res === null) {
            ( /** @type {?} */(this.data)).push(resource);
        }
        else {
            res = resource;
        }
    };
    /**
     * @return {?}
     */
    RelatedDocumentCollection.prototype.hasMorePages = function () {
        if (!this.page.size || this.page.size < 1) {
            return null;
        }
        /** @type {?} */
        var total_resources = this.page.size * (this.page.number - 1) + this.data.length;
        return total_resources < this.page.total_resources;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RelatedDocumentCollection.prototype.setLoaded = function (value) {
        // tslint:disable-next-line:deprecation
        this.is_loading = !value;
        this.loaded = value;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RelatedDocumentCollection.prototype.setLoadedAndPropagate = function (value) {
        this.setLoaded(value);
        if (this.content === 'ids') {
            return;
        }
        ( /** @type {?} */(this.data)).forEach(function (resource) {
            CacheableHelper.propagateLoaded(resource.relationships, value);
        });
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RelatedDocumentCollection.prototype.setBuilded = function (value) {
        this.builded = value;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RelatedDocumentCollection.prototype.setBuildedAndPropagate = function (value) {
        this.setBuilded(value);
        if (this.content === 'ids') {
            return;
        }
        ( /** @type {?} */(this.data)).forEach(function (resource) {
            resource.setLoaded(value);
        });
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RelatedDocumentCollection.prototype.setSource = function (value) {
        this.source = value;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RelatedDocumentCollection.prototype.setSourceAndPropagate = function (value) {
        this.setSource(value);
        this.data.forEach(function (resource) {
            if (resource instanceof Resource) {
                resource.setSource(value);
            }
        });
    };
    /**
     * @param {?=} value
     * @return {?}
     */
    RelatedDocumentCollection.prototype.setCacheLastUpdate = function (value) {
        if (value === void 0) { value = Date.now(); }
        this.cache_last_update = value;
    };
    /**
     * @param {?=} value
     * @return {?}
     */
    RelatedDocumentCollection.prototype.setCacheLastUpdateAndPropagate = function (value) {
        if (value === void 0) { value = Date.now(); }
        this.setCacheLastUpdate(value);
        this.data.forEach(function (resource) {
            if (resource instanceof Resource) {
                resource.setCacheLastUpdate(value);
            }
        });
    };
    /**
     * @param {?=} params
     * @return {?}
     */
    RelatedDocumentCollection.prototype.toObject = function (params) {
        if (!this.builded) {
            return { data: this.data };
        }
        /** @type {?} */
        var data = ( /** @type {?} */(this.data)).map(function (resource) {
            return resource.toObject(params).data;
        });
        return {
            data: data
        };
    };
    return RelatedDocumentCollection;
}(Document));
// unsupported: template constraints.
/**
 * @template R
 */
var DocumentCollection = /** @class */ (function (_super) {
    __extends(DocumentCollection, _super);
    function DocumentCollection() {
        var _this = _super.apply(this, arguments) || this;
        _this.data = [];
        _this.content = 'collection';
        return _this;
    }
    return DocumentCollection;
}(RelatedDocumentCollection));
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Base = /** @class */ (function () {
    function Base() {
    }
    /**
     * @template R
     * @return {?}
     */
    Base.newCollection = function () {
        return new DocumentCollection();
    };
    /**
     * @param {?} ttl
     * @param {?} last_update
     * @return {?}
     */
    Base.isObjectLive = function (ttl, last_update) {
        return ttl >= 0 && Date.now() <= last_update + ttl * 1000;
    };
    /**
     * @template T
     * @param {?} collection
     * @param {?} fc
     * @return {?}
     */
    Base.forEach = function (collection, fc) {
        Object.keys(collection).forEach(function (key) {
            fc(collection[key], key);
        });
    };
    return Base;
}());
Base.ParamsResource = {
    beforepath: '',
    ttl: undefined,
    include: [],
    fields: {},
    id: ''
};
Base.ParamsCollection = {
    beforepath: '',
    ttl: undefined,
    include: [],
    remotefilter: {},
    fields: {},
    smartfilter: {},
    sort: [],
    page: new Page(),
    store_cache_method: 'individual',
    storage_ttl: 0,
    cachehash: ''
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
var CacheMemory = /** @class */ (function () {
    function CacheMemory() {
        this.resources = {};
        this.collections = {};
    }
    /**
     * @return {?}
     */
    CacheMemory.getInstance = function () {
        if (!CacheMemory.instance) {
            CacheMemory.instance = new CacheMemory();
        }
        return CacheMemory.instance;
    };
    /**
     * @return {?}
     */
    CacheMemory.prototype.clearCache = function () {
        this.resources = {};
        this.collections = {};
        CacheMemory.instance = null;
    };
    /**
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    CacheMemory.prototype.getResource = function (type, id) {
        if (this.getKey(type, id) in this.resources) {
            return this.resources[this.getKey(type, id)];
        }
        return null;
    };
    /**
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    CacheMemory.prototype.getResourceOrFail = function (type, id) {
        if (this.getKey(type, id) in this.resources) {
            return this.resources[this.getKey(type, id)];
        }
        throw new Error('The requested resource does not exist in cache memory');
    };
    /**
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    CacheMemory.prototype.getKey = function (type, id) {
        return type + '.' + id;
    };
    /**
     * @param {?} url
     * @return {?}
     */
    CacheMemory.prototype.getOrCreateCollection = function (url) {
        if (!(url in this.collections)) {
            this.collections[url] = new DocumentCollection();
            this.collections[url].source = 'new';
        }
        return this.collections[url];
    };
    /**
     * @param {?} url
     * @param {?} collection
     * @return {?}
     */
    CacheMemory.prototype.setCollection = function (url, collection) {
        // v1: clone collection, because after maybe delete items for localfilter o pagination
        if (!(url in this.collections)) {
            this.collections[url] = new DocumentCollection();
        }
        for (var i = 0; i < collection.data.length; i++) {
            /** @type {?} */
            var resource = collection.data[i];
            // this.collections[url].data.push(resource);
            this.setResource(resource, true);
        }
        this.collections[url].data = collection.data;
        this.collections[url].page = collection.page;
        this.collections[url].cache_last_update = collection.cache_last_update;
    };
    /**
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    CacheMemory.prototype.getOrCreateResource = function (type, id) {
        /** @type {?} */
        var resource = this.getResource(type, id);
        if (resource !== null) {
            return resource;
        }
        resource = Converter.getServiceOrFail(type).new();
        resource.id = id;
        // needed for a lot of request (all and get, tested on multinexo.com)
        this.setResource(resource, false);
        return resource;
    };
    /**
     * @param {?} resource
     * @param {?=} update_lastupdate
     * @return {?}
     */
    CacheMemory.prototype.setResource = function (resource, update_lastupdate) {
        if (update_lastupdate === void 0) { update_lastupdate = false; }
        if (this.getKey(resource.type, resource.id) in this.resources) {
            this.fillExistentResource(resource);
        }
        else {
            this.resources[this.getKey(resource.type, resource.id)] = resource;
        }
        this.resources[this.getKey(resource.type, resource.id)].cache_last_update = update_lastupdate ? Date.now() : 0;
    };
    /**
     * @param {?=} path_includes
     * @return {?}
     */
    CacheMemory.prototype.deprecateCollections = function (path_includes) {
        if (path_includes === void 0) { path_includes = ''; }
        for (var collection_key in this.collections) {
            if (collection_key.includes(path_includes)) {
                this.collections[collection_key].cache_last_update = 0;
            }
        }
        return true;
    };
    /**
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    CacheMemory.prototype.removeResource = function (type, id) {
        /** @type {?} */
        var resource = this.getResource(type, id);
        if (!resource) {
            return;
        }
        Base.forEach(this.collections, function (value, url) {
            value.data.splice(value.data.findIndex(function (resource_on_collection) { return resource_on_collection.type === type && resource_on_collection.id === id; }), 1);
        });
        resource.attributes = {}; // just for confirm deletion on view
        // this.resources[id].relationships = {}; // just for confirm deletion on view
        for (var relationship in resource.relationships) {
            if (resource.relationships[relationship].data === null || resource.relationships[relationship].data === undefined) {
                continue;
            }
            if (resource.relationships[relationship].data instanceof Array) {
                resource.relationships[relationship].data = []; // just in case that there is a for loop using it
            }
            else if (resource.relationships[relationship].data instanceof Object) {
                delete resource.relationships[relationship].data;
            }
        }
        delete this.resources[this.getKey(type, id)];
    };
    /**
     * @param {?} source
     * @return {?}
     */
    CacheMemory.prototype.fillExistentResource = function (source) {
        /** @type {?} */
        var destination = this.getResourceOrFail(source.type, source.id);
        destination.attributes = Object.assign({}, destination.attributes, source.attributes);
        destination.relationships = destination.relationships || source.relationships;
        // remove relationships on destination resource
        // for (let type_alias in destination.relationships) {
        //     // problem with no declared services
        //     if (destination.relationships[type_alias].data === undefined) {
        //         continue;
        //     }
        //     if (!(type_alias in source.relationships)) {
        //         delete destination.relationships[type_alias];
        //     } else {
        //         // relation is a collection
        //         let collection = <DocumentCollection>destination.relationships[type_alias];
        //         // TODO: talkto Pablo, this could be and Object... (following IF statement added by Maxi)
        //         if (!Array.isArray(collection.data)) {
        //             continue;
        //         }
        //         for (let resource of collection.data) {
        //             if (collection.find(resource.id) === null) {
        //                 delete destination.relationships[type_alias];
        //             }
        //         }
        //     }
        // }
        // // add source relationships to destination
        // for (let type_alias in source.relationships) {
        //     // problem with no declared services
        //     if (source.relationships[type_alias].data === undefined) {
        //         continue;
        //     }
        //     if (source.relationships[type_alias].data === null) {
        //         // TODO: FE-92 --- check and improve conditions when building has-one relationships
        //         destination.relationships[type_alias].data = null;
        //         continue;
        //     }
        //     if ('id' in source.relationships[type_alias].data) {
        //         destination.addRelationship(<Resource>source.relationships[type_alias].data, type_alias);
        //     } else {
        //         destination.addRelationships(<Array<Resource>>source.relationships[type_alias].data, type_alias);
        //     }
        // }
    };
    return CacheMemory;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
var DocumentResource = /** @class */ (function (_super) {
    __extends(DocumentResource, _super);
    function DocumentResource() {
        var _this = _super.apply(this, arguments) || this;
        _this.data = /** @type {?} */ (new Resource());
        _this.builded = false;
        _this.content = 'id';
        return _this;
    }
    /**
     * @param {?} data_resource
     * @return {?}
     */
    DocumentResource.prototype.fill = function (data_resource) {
        this.builded = false;
        this.content = 'id';
        this.data_resource = data_resource;
        if (data_resource === null) {
            this.data = null;
            return;
        }
        if (!this.data) {
            this.data = /** @type {?} */ (CacheMemory.getInstance().getOrCreateResource(data_resource.data.type, data_resource.data.id));
        }
        if (this.data.fill(data_resource)) {
            this.builded = true;
            this.content = 'resource';
        }
        this.meta = data_resource.meta || {};
    };
    /**
     * @return {?}
     */
    DocumentResource.prototype.unsetData = function () {
        this.data = undefined;
        this.builded = false;
    };
    return DocumentResource;
}(Document));
var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var DexieDataProvider = /** @class */ (function () {
    function DexieDataProvider() {
        if (DexieDataProvider.db) {
            return;
        }
        DexieDataProvider.db = new Dexie('dexie_data_provider');
        DexieDataProvider.db.version(1).stores({
            collections: '',
            elements: ''
        });
    }
    /**
     * @param {?} key
     * @param {?=} table_name
     * @return {?}
     */
    DexieDataProvider.prototype.getElement = function (key, table_name) {
        if (table_name === void 0) { table_name = 'elements'; }
        return __awaiter$2(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, DexieDataProvider.db.open()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, DexieDataProvider.db.table(table_name).get(key)];
                    case 2:
                        data = _a.sent();
                        if (data === undefined) {
                            throw new Error(key + ' not found.');
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * @param {?} keys
     * @param {?=} table_name
     * @return {?}
     */
    DexieDataProvider.prototype.getElements = function (keys, table_name) {
        if (table_name === void 0) { table_name = 'elements'; }
        return __awaiter$2(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = {};
                        return [4 /*yield*/, DexieDataProvider.db
                                .table(table_name)
                                .where(':id')
                                .anyOf(keys)
                                .each(function (element) {
                                data[element.data.type + '.' + element.data.id] = element;
                            })];
                    case 1:
                        _a.sent();
                        // we need to maintain same order, database return ordered by key
                        return [2 /*return*/, keys.map(function (key) {
                                return data[key];
                            })];
                }
            });
        });
    };
    /**
     * @param {?} key_start_with
     * @param {?} changes
     * @param {?=} table_name
     * @return {?}
     */
    DexieDataProvider.prototype.updateElements = function (key_start_with, changes, table_name) {
        if (table_name === void 0) { table_name = 'elements'; }
        return __awaiter$2(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, DexieDataProvider.db.open().then(function () { return __awaiter$2(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (key_start_with === '') {
                                return [2 /*return*/, DexieDataProvider.db.table(table_name).clear()];
                            }
                            else {
                                return [2 /*return*/, DexieDataProvider.db
                                        .table(table_name)
                                        .where(':id')
                                        .startsWith(key_start_with)
                                        .delete()
                                        .then(function () { return undefined; })];
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    /**
     * @param {?} elements
     * @param {?=} table_name
     * @return {?}
     */
    DexieDataProvider.prototype.saveElements = function (elements, table_name) {
        if (table_name === void 0) { table_name = 'elements'; }
        return __awaiter$2(this, void 0, void 0, function () {
            var keys, items;
            return __generator(this, function (_a) {
                keys = [];
                items = elements.map(function (element) {
                    keys.push(element.key);
                    return element.content;
                });
                return [2 /*return*/, DexieDataProvider.db.open().then(function () {
                        DexieDataProvider.db.table(table_name).bulkPut(items, keys);
                    })];
            });
        });
    };
    return DexieDataProvider;
}());
var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
function IStoredCollection() { }
/** @type {?} */
IStoredCollection.prototype.updated_at;
/** @type {?} */
IStoredCollection.prototype.keys;
var JsonRipper = /** @class */ (function () {
    function JsonRipper() {
        this.dataProvider = new DexieDataProvider();
    }
    /**
     * @param {?} key
     * @param {?=} include
     * @return {?}
     */
    JsonRipper.prototype.getResource = function (key, include) {
        if (include === void 0) { include = []; }
        return __awaiter$1(this, void 0, void 0, function () {
            var stored_resource, included_keys, included_resources;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDataResources([key])];
                    case 1:
                        stored_resource = (_a.sent()).shift();
                        if (stored_resource === undefined) {
                            throw new Error("Resource " + key + " don't found.");
                        }
                        if (include.length === 0) {
                            return [2 /*return*/, stored_resource];
                        }
                        included_keys = [];
                        include.forEach(function (relationship_alias) {
                            // @NOTE: typescript doesn't detect throwError added a few lines above when stored_resource === undefnied
                            if (!stored_resource || !stored_resource.data.relationships || !stored_resource.data.relationships[relationship_alias]) {
                                // this is a classic problem when relationship property is missing on included resources
                                throw new Error('We dont have relation_alias on stored data resource');
                            }
                            /** @type {?} */
                            var relationship = stored_resource.data.relationships[relationship_alias].data;
                            if (relationship instanceof Array) {
                                relationship.forEach(function (related_resource) {
                                    included_keys.push(JsonRipper.getResourceKey(related_resource));
                                });
                            }
                            else if (relationship && 'id' in relationship) {
                                included_keys.push(JsonRipper.getResourceKey(relationship));
                            }
                        });
                        return [4 /*yield*/, this.getDataResources(included_keys)];
                    case 2:
                        included_resources = _a.sent();
                        return [2 /*return*/, Object.assign({}, stored_resource, { included: included_resources.map(function (document_resource) { return document_resource.data; }) })];
                }
            });
        });
    };
    /**
     * @param {?} url
     * @param {?=} include
     * @return {?}
     */
    JsonRipper.prototype.getCollection = function (url, include) {
        if (include === void 0) { include = []; }
        return __awaiter$1(this, void 0, void 0, function () {
            var stored_collection, data_resources, ret, included_keys, included_resources;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDataCollection(url)];
                    case 1:
                        stored_collection = _a.sent();
                        return [4 /*yield*/, this.getDataResources(stored_collection.keys)];
                    case 2:
                        data_resources = _a.sent();
                        ret = {
                            data: data_resources.map(function (data_resource) { return data_resource.data; }),
                            cache_last_update: stored_collection.updated_at
                        };
                        if (include.length === 0) {
                            return [2 /*return*/, ret];
                        }
                        included_keys = [];
                        include.forEach(function (relationship_alias) {
                            data_resources.forEach(function (resource) {
                                if (!resource.data.relationships || !resource.data.relationships[relationship_alias]) {
                                    return;
                                }
                                /** @type {?} */
                                var relationship = resource.data.relationships[relationship_alias].data;
                                if (relationship instanceof Array) {
                                    relationship.forEach(function (related_resource) {
                                        included_keys.push(JsonRipper.getResourceKey(related_resource));
                                    });
                                }
                                else if ('id' in relationship) {
                                    included_keys.push(JsonRipper.getResourceKey(relationship));
                                }
                            });
                        });
                        return [4 /*yield*/, this.getDataResources(included_keys)];
                    case 3:
                        included_resources = _a.sent();
                        return [2 /*return*/, Object.assign({}, ret, { included: included_resources.map(function (document_resource) { return document_resource.data; }) })];
                }
            });
        });
    };
    /**
     * @param {?} url
     * @return {?}
     */
    JsonRipper.prototype.getDataCollection = function (url) {
        return __awaiter$1(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /** @type {?} */ (this.dataProvider.getElement(url, 'collections'))];
            });
        });
    };
    /**
     * @param {?} keys
     * @return {?}
     */
    JsonRipper.prototype.getDataResources = function (keys) {
        return __awaiter$1(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, /** @type {?} */ (this.dataProvider.getElements(keys, 'elements'))];
            });
        });
    };
    /**
     * @param {?} url
     * @param {?} collection
     * @param {?=} include
     * @return {?}
     */
    JsonRipper.prototype.saveCollection = function (url, collection, include) {
        if (include === void 0) { include = []; }
        this.dataProvider.saveElements(JsonRipper.collectionToElement(url, collection), 'collections');
        this.dataProvider.saveElements(JsonRipper.collectionResourcesToElements(collection, include), 'elements');
    };
    /**
     * @param {?} resource
     * @param {?=} include
     * @return {?}
     */
    JsonRipper.prototype.saveResource = function (resource, include) {
        if (include === void 0) { include = []; }
        return __awaiter$1(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataProvider.saveElements(JsonRipper.toResourceElements(JsonRipper.getResourceKey(resource), resource, include), 'elements')];
            });
        });
    };
    /**
     * @param {?} url
     * @param {?} collection
     * @return {?}
     */
    JsonRipper.collectionToElement = function (url, collection) {
        /** @type {?} */
        var collection_element = {
            key: url,
            content: { updated_at: Date.now(), keys: /** @type {?} */ ([]) }
        };
        collection.data.forEach(function (resource) {
            /** @type {?} */
            var key = JsonRipper.getResourceKey(resource);
            collection_element.content.keys.push(key);
        });
        return [collection_element];
    };
    /**
     * @param {?} collection
     * @param {?=} include
     * @return {?}
     */
    JsonRipper.collectionResourcesToElements = function (collection, include) {
        if (include === void 0) { include = []; }
        /** @type {?} */
        var elements = [];
        collection.data.forEach(function (resource) {
            /** @type {?} */
            var key = JsonRipper.getResourceKey(resource);
            elements.push.apply(elements, JsonRipper.toResourceElements(key, resource, include));
        });
        return elements;
    };
    /**
     * @param {?} key
     * @param {?} resource
     * @param {?=} include
     * @return {?}
     */
    JsonRipper.toResourceElements = function (key, resource, include) {
        if (include === void 0) { include = []; }
        /** @type {?} */
        var elements = [
            {
                key: key,
                content: resource.toObject()
            }
        ];
        elements[0].content["data"].cache_last_update = Date.now();
        include.forEach(function (relationship_alias) {
            /** @type {?} */
            var relationship = resource.relationships[relationship_alias];
            if (relationship instanceof DocumentCollection) {
                relationship.data.forEach(function (related_resource) {
                    elements.push(JsonRipper.getElement(related_resource));
                });
            }
            else if (relationship instanceof DocumentResource) {
                if (relationship.data === null || relationship.data === undefined) {
                    return;
                }
                elements.push(JsonRipper.getElement(relationship.data));
            }
        });
        return elements;
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    JsonRipper.getResourceKey = function (resource) {
        return resource.type + '.' + resource.id;
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    JsonRipper.getElement = function (resource) {
        return {
            key: JsonRipper.getResourceKey(resource),
            content: resource.toObject()
        };
    };
    /**
     * @param {?} key_start_with
     * @return {?}
     */
    JsonRipper.prototype.deprecateCollection = function (key_start_with) {
        return __awaiter$1(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.dataProvider.updateElements(key_start_with, {}, 'collections')];
            });
        });
    };
    return JsonRipper;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} cacheable
 * @param {?=} ttl
 * @return {?}
 */
function isLive(cacheable, ttl) {
    /** @type {?} */
    var ttl_in_seconds = ttl && typeof ttl === 'number' ? ttl : cacheable.ttl || 0;
    return Date.now() < cacheable.cache_last_update + ttl_in_seconds * 1000;
}
/**
 * @param {?} resource
 * @param {?} includes
 * @return {?}
 */
function relationshipsAreBuilded(resource, includes) {
    if (includes.length === 0) {
        return true;
    }
    for (var relationship_alias in resource.relationships) {
        if (includes.includes(relationship_alias) && !resource.relationships[relationship_alias].builded) {
            return false;
        }
    }
    return true;
}
/**
 * @deprecated since 2.2.0
 * @param {?} document
 * @return {?}
 */
/**
 * @deprecated since 2.2.0
 * @param {?} document
 * @return {?}
 */
/**
 * @param {?} target
 * @param {?} key
 * @param {?} descriptor
 * @return {?}
 */
function serviceIsRegistered(target, key, descriptor) {
    /** @type {?} */
    var original = descriptor.value;
    descriptor.value = function () {
        /** @type {?} */
        var args = Array.prototype.slice.call(arguments);
        /** @type {?} */
        var type;
        try {
            if (typeof args[0] === 'string') {
                type = args[0];
            }
            else {
                type = args[0].type;
            }
        }
        catch (err) {
            console.warn("ERROR: First argument of methods decorated with serviceIsRegistered has to be string or Resource.");
            return null;
        }
        /** @type {?} */
        var service_is_registered = Core.me.getResourceService(type);
        if (!service_is_registered) {
            console.warn("ERROR: " + type + " service has not been registered.");
            return null;
        }
        /** @type {?} */
        var result = original.apply(this, args);
        return result;
    };
    return descriptor;
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var JsonapiConfig = /** @class */ (function () {
    function JsonapiConfig() {
        this.url = 'http://yourdomain/api/v1/';
        this.params_separator = '?';
        this.unify_concurrency = true;
        this.cache_prerequests = true;
        this.cachestore_support = true;
        this.parameters = {
            page: {
                number: 'page[number]',
                size: 'page[size]'
            }
        };
    }
    return JsonapiConfig;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Http = /** @class */ (function () {
    /**
     * @param {?} request
     * @param {?} platformId
     * @param {?} http
     * @param {?} rsJsonapiConfig
     */
    function Http(request, platformId, http$$1, rsJsonapiConfig) {
        this.request = request;
        this.platformId = platformId;
        this.http = http$$1;
        this.rsJsonapiConfig = rsJsonapiConfig;
        this.get_requests = {};
    }
    /**
     * @param {?} path
     * @param {?} method
     * @param {?=} data
     * @return {?}
     */
    Http.prototype.exec = function (path, method, data) {
        var _this = this;
        /** @type {?} */
        var url = this.rsJsonapiConfig.url;
        /** @type {?} */
        var req = {
            body: data || null,
            headers: new HttpHeaders({
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json'
            })
        };
        if (isPlatformServer(this.platformId) && !url.match(/^http\:|^https\:|^\/\//)) {
            /** @type {?} */
            var headers = this.request.headers;
            /** @type {?} */
            var proto = (headers['x-forwarded-proto']) ? headers['x-forwarded-proto'].split(',')[0] : (headers['proto']) ? headers['proto'] : 'http';
            /** @type {?} */
            var host = (headers['x-forwarded-host']) ? headers['x-forwarded-host'].split(',')[0] : headers['host'];
            url = proto + "://" + host + url;
        }
        // NOTE: prevent duplicate GET requests
        if (method === 'get') {
            if (!this.get_requests[path]) {
                /** @type {?} */
                var obs = this.http.request(method, url + path, req).pipe(tap(function () {
                    delete _this.get_requests[path];
                }), share());
                this.get_requests[path] = obs;
                return obs;
            }
            return this.get_requests[path];
        }
        return this.http.request(method, url + path, req).pipe(tap(function () {
            delete _this.get_requests[path];
        }), share());
    };
    return Http;
}());
Http.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Http.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [REQUEST,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: HttpClient },
    { type: JsonapiConfig }
]; };
var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
function IStoreElement() { }
/** @type {?} */
IStoreElement.prototype.time;
var StoreService = /** @class */ (function () {
    function StoreService() {
        this.db = new Dexie('jsonapi_db');
        this.db.version(1).stores({
            collections: '',
            elements: ''
        });
        this.checkIfIsTimeToClean();
    }
    /**
     * @param {?} type
     * @param {?} id_or_url
     * @return {?}
     */
    StoreService.prototype.getDataObject = function (type, id_or_url) {
        return __awaiter$3(this, void 0, void 0, function () {
            var table_name, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        table_name = type === 'collection' ? 'collections' : 'elements';
                        return [4 /*yield*/, this.db.open()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.db.table(table_name).get(type + '.' + id_or_url)];
                    case 2:
                        item = _a.sent();
                        if (item === undefined) {
                            throw new Error();
                        }
                        return [2 /*return*/, item];
                }
            });
        });
    };
    /**
     * @param {?} keys
     * @return {?}
     */
    StoreService.prototype.getDataResources = function (keys) {
        return __awaiter$3(this, void 0, void 0, function () {
            var collection, resources_by_id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        collection = this.db
                            .table('elements')
                            .where(':id')
                            .anyOf(keys);
                        resources_by_id = {};
                        return [4 /*yield*/, collection.each(function (item) {
                                resources_by_id[item.id] = item;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, resources_by_id];
                }
            });
        });
    };
    /**
     * @param {?} type
     * @param {?} url_or_id
     * @param {?} value
     * @return {?}
     */
    StoreService.prototype.saveResource = function (type, url_or_id, value) {
        var _this = this;
        /** @type {?} */
        var data_resource_storage = Object.assign({ cache_last_update: Date.now() }, value);
        this.db.open().then(function () { return __awaiter$3(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.table('elements').put(data_resource_storage, type + '.' + url_or_id)];
            });
        }); });
    };
    /**
     * @param {?} url_or_id
     * @param {?} value
     * @return {?}
     */
    StoreService.prototype.saveCollection = function (url_or_id, value) {
        var _this = this;
        /** @type {?} */
        var data_collection_storage = Object.assign({ cache_last_update: Date.now() }, value);
        this.db.open().then(function () { return __awaiter$3(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db.table('collections').put(data_collection_storage, 'collection.' + url_or_id)];
            });
        }); });
    };
    /**
     * @return {?}
     */
    StoreService.prototype.clearCache = function () {
        var _this = this;
        this.db.open().then(function () { return __awaiter$3(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .table('elements')
                        .toCollection()
                        .delete()];
            });
        }); });
        this.db.open().then(function () { return __awaiter$3(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .table('collections')
                        .toCollection()
                        .delete()];
            });
        }); });
    };
    /**
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    StoreService.prototype.deprecateResource = function (type, id) {
        var _this = this;
        this.db.open().then(function () { return __awaiter$3(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .table('elements')
                        .where(':id')
                        .startsWith(type + '.' + id)
                        .modify({ cache_last_update: 0 })];
            });
        }); });
    };
    /**
     * @param {?} key_start_with
     * @return {?}
     */
    StoreService.prototype.deprecateCollection = function (key_start_with) {
        var _this = this;
        this.db.open().then(function () { return __awaiter$3(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.db
                        .table('collections')
                        .where(':id')
                        .startsWith(key_start_with)
                        .modify({ cache_last_update: 0 })];
            });
        }); });
    };
    /**
     * @param {?} key
     * @return {?}
     */
    StoreService.prototype.removeObjectsWithKey = function (key) {
        /*
                this.allstore.removeItem(key);
                await this.allstore.getItems().then(async result => {
                    for (let saved_resource_key in result) {
                        let resource_id_split = key.split('.');
                        let resource_id = resource_id_split[resource_id_split.length - 1];
                        if (
                            Array.isArray(result[saved_resource_key].data) &&
                            result[saved_resource_key].data.find(resource => resource.id === resource_id)
                        ) {
                            result[saved_resource_key].data.splice(
                                result[saved_resource_key].data.findIndex(resource => resource.id === resource_id),
                                1
                            );
                            await this.allstore.setItem(saved_resource_key, result[saved_resource_key]);
                        }
                    }
                });
                */
        return __awaiter$3(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     * @return {?}
     */
    StoreService.prototype.checkIfIsTimeToClean = function () {
        // check if is time to check cachestore
        /*
                this.globalstore
                    .getItem('_lastclean_time')
                    .then((success: IStoreElement) => {
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
                */
    };
    /**
     * @return {?}
     */
    StoreService.prototype.checkAndDeleteOldElements = function () {
        /*
                this.allstore
                    .keys()
                    .then(success => {
                        Base.forEach(success, key => {
                            // recorremos cada item y vemos si es tiempo de removerlo
                            this.allstore
                                .getItem(key)
                                .then((success2: ICacheableDataCollection | ICacheableDataResource) => {
                                    if (Date.now() >= success2.cache_last_update + 24 * 3600 * 1000) {
                                        this.allstore.removeItem(key);
                                    }
                                })
                                .catch(noop);
                        });
                    })
                    .catch(noop);
                */
    };
    return StoreService;
}());
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Core = /** @class */ (function () {
    /**
     * @param {?} user_config
     * @param {?} jsonapiStoreService
     * @param {?} jsonapiHttp
     */
    function Core(user_config, jsonapiStoreService, jsonapiHttp) {
        this.loadingsCounter = 0;
        this.loadingsStart = noop$1;
        this.loadingsDone = noop$1;
        this.loadingsError = noop$1;
        this.loadingsOffline = noop$1;
        this.resourceServices = {};
        this.config = new JsonapiConfig();
        for (var k in this.config) {
            ( /** @type {?} */(this.config))[k] = user_config[k] !== undefined ? user_config[k] : ( /** @type {?} */(this.config))[k];
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
    Core.delete = function (path) {
        return Core.exec(path, 'DELETE');
    };
    /**
     * @param {?} path
     * @return {?}
     */
    Core.get = function (path) {
        return Core.exec(path, 'get');
    };
    /**
     * @param {?} path
     * @param {?} method
     * @param {?=} data
     * @param {?=} call_loadings_error
     * @return {?}
     */
    Core.exec = function (path, method, data, call_loadings_error) {
        if (call_loadings_error === void 0) { call_loadings_error = true; }
        Core.me.refreshLoadings(1);
        return Core.injectedServices.JsonapiHttp.exec(path, method, data).pipe(
        // map(data => { return data.body }),
        tap(function () { return Core.me.refreshLoadings(-1); }), catchError(function (error) {
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
    };
    /**
     * @template R
     * @param {?} clase
     * @return {?}
     */
    Core.prototype.registerService = function (clase) {
        if (clase.type in this.resourceServices) {
            return false;
        }
        this.resourceServices[clase.type] = clase;
        return /** @type {?} */ (clase);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    Core.prototype.getResourceService = function (type) {
        return this.resourceServices[type];
    };
    /**
     * @param {?} type
     * @return {?}
     */
    Core.prototype.getResourceServiceOrFail = function (type) {
        /** @type {?} */
        var service = this.resourceServices[type];
        if (!service) {
            throw new Error("The requested service with type " + type + " has not been registered, please use register() method or @Autoregister() decorator");
        }
        return service;
    };
    /**
     * @param {?} resource_type
     * @param {?} resource_id
     * @return {?}
     */
    Core.removeCachedResource = function (resource_type, resource_id) {
        CacheMemory.getInstance().removeResource(resource_type, resource_id);
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    Core.setCachedResource = function (resource) {
        CacheMemory.getInstance().setResource(resource, true);
    };
    /**
     * @param {?} type
     * @return {?}
     */
    Core.deprecateCachedCollections = function (type) {
        /** @type {?} */
        var service = Core.me.getResourceServiceOrFail(type);
        /** @type {?} */
        var path = new PathBuilder();
        path.applyParams(service);
        CacheMemory.getInstance().deprecateCollections(path.getForCache());
    };
    /**
     * @param {?} factor
     * @return {?}
     */
    Core.prototype.refreshLoadings = function (factor) {
        this.loadingsCounter += factor;
        if (this.loadingsCounter === 0) {
            this.loadingsDone();
        }
        else if (this.loadingsCounter === 1) {
            this.loadingsStart();
        }
    };
    /**
     * @return {?}
     */
    Core.prototype.clearCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var json_ripper;
            return __generator(this, function (_a) {
                Core.injectedServices.JsonapiStoreService.clearCache();
                CacheMemory.getInstance().clearCache();
                json_ripper = new JsonRipper();
                return [2 /*return*/, json_ripper.deprecateCollection('').then(function () { return true; })];
            });
        });
    };
    /**
     * @template R
     * @param {?} resource
     * @param {...?} relations_alias_to_duplicate_too
     * @return {?}
     */
    Core.prototype.duplicateResource = function (resource) {
        var _this = this;
        var relations_alias_to_duplicate_too = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            relations_alias_to_duplicate_too[_i - 1] = arguments[_i];
        }
        /** @type {?} */
        var newresource = /** @type {?} */ (this.getResourceServiceOrFail(resource.type).new());
        newresource.id = 'new_' + Math.floor(Math.random() * 10000).toString();
        newresource.attributes = Object.assign({}, newresource.attributes, resource.attributes);
        var _loop_1 = function (alias) {
            /** @type {?} */
            var relationship = resource.relationships[alias];
            if (!relationship.data) {
                newresource.relationships[alias] = resource.relationships[alias];
                return "continue";
            }
            if ('id' in relationship.data) {
                // relation hasOne
                if (relations_alias_to_duplicate_too.indexOf(alias) > -1) {
                    newresource.addRelationship(this_1.duplicateResource(/** @type {?} */ (relationship.data)), alias);
                }
                else {
                    newresource.addRelationship(/** @type {?} */ (relationship.data), alias);
                }
            }
            else {
                // relation hasMany
                if (relations_alias_to_duplicate_too.indexOf(alias) > -1) {
                    relationship.data.forEach(function (relationresource) {
                        newresource.addRelationship(_this.duplicateResource(/** @type {?} */ (relationresource)), alias);
                    });
                }
                else {
                    newresource.addRelationships(/** @type {?} */ (relationship.data), alias);
                }
            }
        };
        var this_1 = this;
        for (var alias in resource.relationships) {
            _loop_1(alias);
        }
        return newresource;
    };
    return Core;
}());
Core.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Core.ctorParameters = function () { return [
    { type: JsonapiConfig, decorators: [{ type: Optional }] },
    { type: StoreService },
    { type: Http }
]; };
__decorate([
    serviceIsRegistered,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], Core, "removeCachedResource", null);
__decorate([
    serviceIsRegistered,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Resource]),
    __metadata("design:returntype", void 0)
], Core, "setCachedResource", null);
__decorate([
    serviceIsRegistered,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], Core, "deprecateCachedCollections", null);
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var NgxJsonapiModule = /** @class */ (function () {
    /**
     * @param {?} parentModule
     * @param {?} jsonapiCore
     */
    function NgxJsonapiModule(parentModule, jsonapiCore) {
        if (parentModule) {
            throw new Error('NgxJsonapiModule is already loaded. Import it in the AppModule only');
        }
    }
    /**
     * @param {?} config
     * @return {?}
     */
    NgxJsonapiModule.forRoot = function (config) {
        return {
            ngModule: NgxJsonapiModule,
            providers: [{ provide: JsonapiConfig, useValue: config }]
        };
    };
    return NgxJsonapiModule;
}());
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
NgxJsonapiModule.ctorParameters = function () { return [
    { type: NgxJsonapiModule, decorators: [{ type: Optional }, { type: SkipSelf }] },
    { type: Core }
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @deprecated since version 3.0.0
 * @return {?}
 */
function Autoregister() {
    return function (target) {
        /**/
    };
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var UrlParamsBuilder = /** @class */ (function () {
    function UrlParamsBuilder() {
    }
    /**
     * @param {?} params
     * @return {?}
     */
    UrlParamsBuilder.prototype.toparams = function (params) {
        var _this = this;
        /** @type {?} */
        var ret = '';
        Base.forEach(params, function (value, key) {
            ret += _this.toparamsarray(value, '&' + key);
        });
        return ret.slice(1);
    };
    /**
     * @param {?} params
     * @param {?} add
     * @return {?}
     */
    UrlParamsBuilder.prototype.toparamsarray = function (params, add) {
        var _this = this;
        /** @type {?} */
        var ret = '';
        if (Array.isArray(params)) {
            Base.forEach(params, function (value, key) {
                ret += add + '[]=' + value;
            });
        }
        else if (isObject(params)) {
            Base.forEach(params, function (value, key) {
                ret += _this.toparamsarray(value, add + '[' + key + ']');
            });
        }
        else {
            ret += add + '=' + params;
        }
        return ret;
    };
    return UrlParamsBuilder;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var PathCollectionBuilder = /** @class */ (function (_super) {
    __extends(PathCollectionBuilder, _super);
    function PathCollectionBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} service
     * @param {?=} params
     * @return {?}
     */
    PathCollectionBuilder.prototype.applyParams = function (service, params) {
        if (params === void 0) { params = {}; }
        _super.prototype.applyParams.call(this, service, params);
        /** @type {?} */
        var paramsurl = new UrlParamsBuilder();
        if (params.remotefilter && Object.keys(params.remotefilter).length > 0) {
            if (service.parseToServer) {
                service.parseToServer(params.remotefilter);
            }
            this.addParam(paramsurl.toparams({ filter: params.remotefilter }));
        }
        if (params.page) {
            if (params.page.number > 1) {
                this.addParam(this.getPageConfig().number + '=' + params.page.number);
            }
            if (params.page.size) {
                this.addParam(this.getPageConfig().size + '=' + params.page.size);
            }
        }
        if (params.sort && params.sort.length) {
            this.addParam('sort=' + params.sort.join(','));
        }
    };
    /**
     * @return {?}
     */
    PathCollectionBuilder.prototype.getPageConfig = function () {
        return ((Core.injectedServices.rsJsonapiConfig.parameters && Core.injectedServices.rsJsonapiConfig.parameters.page) || {
            number: 'number',
            size: 'size'
        });
    };
    /**
     * @param {?} param
     * @return {?}
     */
    PathCollectionBuilder.prototype.addParam = function (param) {
        this.get_params.push(param);
    };
    return PathCollectionBuilder;
}(PathBuilder));
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @record
 */
function IClonedResource() { }
/** @type {?} */
IClonedResource.prototype.toObject;
/** @type {?} */
IClonedResource.prototype.superToObject;
/**
 * @param {?} arg
 * @return {?}
 */
function isClonedResource(arg) {
    return arg && arg.toObject && typeof arg.toObject === 'function' && arg.superToObject && typeof arg.superToObject === 'function';
}
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ClonedDocumentResource = /** @class */ (function () {
    /**
     * @param {?} cloned_resource
     * @param {?} parent_resource
     * @param {?=} params
     */
    function ClonedDocumentResource(cloned_resource, parent_resource, params) {
        // calling toObject two times because we need different objects
        if (parent_resource instanceof Resource) {
            this.parent_resource_object = parent_resource.toObject(params);
        }
        else {
            this.parent_resource_object = { data: parent_resource };
        }
        if (isClonedResource(cloned_resource)) {
            this.resource_object = cloned_resource.superToObject(params);
        }
        else {
            this.resource_object = { data: cloned_resource };
        }
        this.removeDuplicatedAttributes();
        this.removeDuplicatedRelationships();
        this.removeDuplicatedIncludes();
    }
    /**
     * @return {?}
     */
    ClonedDocumentResource.prototype.getResourceObject = function () {
        return this.resource_object;
    };
    /**
     * @return {?}
     */
    ClonedDocumentResource.prototype.removeDuplicatedIncludes = function () {
        if (!this.resource_object.included || !this.parent_resource_object.included) {
            return this;
        }
        /** @type {?} */
        var parent_included = this.parent_resource_object.included;
        this.resource_object.included = this.resource_object.included.filter(function (included_resource) {
            return !isEqual(included_resource, parent_included.find(function (include) { return include.id === included_resource.id; }));
        });
        this.resource_object.included = this.resource_object.included.map(function (included) {
            if (!parent_included.find(function (include) { return include.id === included.id; })) {
                return included;
            }
            return new ClonedDocumentResource(included, parent_included.find(function (include) { return include.id === included.id; })).getResourceObject()
                .data;
        });
        return this;
    };
    /**
     * @return {?}
     */
    ClonedDocumentResource.prototype.removeDuplicatedRelationships = function () {
        if (!this.resource_object.data.relationships || !this.parent_resource_object.data.relationships) {
            return this;
        }
        for (var relationship in this.resource_object.data.relationships) {
            if (isEqual(this.resource_object.data.relationships[relationship], this.parent_resource_object.data.relationships[relationship])) {
                delete this.resource_object.data.relationships[relationship];
            }
        }
        return this;
    };
    /**
     * @return {?}
     */
    ClonedDocumentResource.prototype.removeDuplicatedAttributes = function () {
        if (!this.resource_object.data.attributes || !this.parent_resource_object.data.attributes) {
            return this;
        }
        for (var attribute in this.resource_object.data.attributes) {
            if (this.resource_object.data.attributes[attribute] === this.parent_resource_object.data.attributes[attribute]) {
                delete this.resource_object.data.attributes[attribute];
            }
        }
        return this;
    };
    return ClonedDocumentResource;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template T
 */
var ClonedResource = /** @class */ (function (_super) {
    __extends(ClonedResource, _super);
    /**
     * @param {?} resource
     */
    function ClonedResource(resource) {
        var _this = _super.call(this) || this;
        // @note using cloneDeep because the parent may have changed since clone (example: data received from socket while editing clone)
        _this.parent = cloneDeep(resource);
        _this.type = _this.parent.type; // this line should go to fill method?
        delete _this.relationships;
        /** @type {?} */
        var include = Object.keys(_this.parent.relationships);
        _this.fill(_this.parent.toObject({ include: include }));
        _this.copySourceFromParent();
        return _this;
    }
    /**
     * @param {?=} params
     * @return {?}
     */
    ClonedResource.prototype.toObject = function (params) {
        return new ClonedDocumentResource(this, this.parent, params).getResourceObject();
    };
    /**
     * @param {?=} params
     * @return {?}
     */
    ClonedResource.prototype.superToObject = function (params) {
        return _super.prototype.toObject.call(this, params);
    };
    /**
     * @return {?}
     */
    ClonedResource.prototype.copySourceFromParent = function () {
        this.source = this.parent.source;
        for (var relationship in this.relationships) {
            this.relationships[relationship].source = this.parent.relationships[relationship].source;
        }
    };
    return ClonedResource;
}(Resource));
var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// unsupported: template constraints.
/**
 * @template R
 */
var Service = /** @class */ (function () {
    function Service() {
        var _this = this;
        this.resource = Resource;
        setTimeout(function () { return _this.register(); });
    }
    /**
     * @return {?}
     */
    Service.prototype.register = function () {
        if (Core.me === null) {
            throw new Error('Error: you are trying register `' + this.type + '` before inject JsonapiCore somewhere, almost one time.');
        }
        return Core.me.registerService(this);
    };
    /**
     * @deprecated since 2.2.0. Use new() method.
     * @return {?}
     */
    Service.prototype.newResource = function () {
        return this.new();
    };
    /**
     * @return {?}
     */
    Service.prototype.newCollection = function () {
        return new DocumentCollection();
    };
    /**
     * @return {?}
     */
    Service.prototype.new = function () {
        /** @type {?} */
        var resource = new this.resource();
        resource.type = this.type;
        // issue #36: just if service is not registered yet.
        this.getService();
        resource.reset();
        return /** @type {?} */ (resource);
    };
    /**
     * @return {?}
     */
    Service.prototype.getPrePath = function () {
        return '';
    };
    /**
     * @return {?}
     */
    Service.prototype.getPath = function () {
        return this.path || this.type;
    };
    /**
     * @param {?} id
     * @param {?=} params
     * @return {?}
     */
    Service.prototype.getClone = function (id, params) {
        if (params === void 0) { params = {}; }
        return this.get(id, params).pipe(map(function (resource) {
            // return resource.clone();
            return new ClonedResource(resource);
        }));
    };
    /**
     * @param {?} id
     * @param {?=} params
     * @return {?}
     */
    Service.prototype.pathForGet = function (id, params) {
        if (params === void 0) { params = {}; }
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        var path = new PathBuilder();
        path.applyParams(this, params);
        path.appendPath(id);
        return path.get();
    };
    /**
     * @param {?} id
     * @param {?=} params
     * @return {?}
     */
    Service.prototype.get = function (id, params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        var path = new PathBuilder();
        path.applyParams(this, params);
        path.appendPath(id);
        /** @type {?} */
        var resource = this.getOrCreateResource(id);
        resource.setLoaded(false);
        /** @type {?} */
        var subject = new BehaviorSubject(resource);
        if (Object.keys(params.fields || []).length > 0) {
            // memory/store cache doesnt support fields
            this.getGetFromServer(path, resource, subject);
        }
        else if (isLive(resource, params.ttl) && relationshipsAreBuilded(resource, params.include || [])) {
            // data on memory and its live
            resource.setLoaded(true);
            setTimeout(function () { return subject.complete(); }, 0);
        }
        else if (resource.cache_last_update === 0) {
            // we dont have any data on memory
            this.getGetFromLocal(params, path, resource)
                .then(function () {
                subject.next(resource);
                setTimeout(function () { return subject.complete(); }, 0);
            })
                .catch(function () {
                resource.setLoaded(false);
                _this.getGetFromServer(path, resource, subject);
            });
        }
        else {
            this.getGetFromServer(path, resource, subject);
        }
        return subject.asObservable();
    };
    /**
     * @param {?=} params
     * @param {?=} path
     * @param {?=} resource
     * @return {?}
     */
    Service.prototype.getGetFromLocal = function (params, path, resource) {
        if (params === void 0) { params = {}; }
        return __awaiter$4(this, void 0, void 0, function () {
            var json_ripper, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // STORE
                        if (!Core.injectedServices.rsJsonapiConfig.cachestore_support) {
                            throw new Error('We cant handle this request');
                        }
                        resource.setLoaded(false);
                        json_ripper = new JsonRipper();
                        return [4 /*yield*/, json_ripper.getResource(JsonRipper.getResourceKey(resource), path.includes)];
                    case 1:
                        success = _a.sent();
                        resource.fill(success);
                        resource.setSource('store');
                        // when fields is set, get resource form server
                        if (isLive(resource, params.ttl)) {
                            resource.setLoadedAndPropagate(true);
                            // resource.setBuildedAndPropagate(true);
                            return [2 /*return*/];
                        }
                        throw new Error('Resource is dead!');
                }
            });
        });
    };
    /**
     * @param {?} path
     * @param {?} resource
     * @param {?} subject
     * @return {?}
     */
    Service.prototype.getGetFromServer = function (path, resource, subject) {
        Core.get(path.get()).subscribe(function (success) {
            resource.fill(/** @type {?} */ (success));
            resource.cache_last_update = Date.now();
            resource.setLoadedAndPropagate(true);
            resource.setSourceAndPropagate('server');
            // this.getService().cachememory.setResource(resource, true);
            if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
                /** @type {?} */
                var json_ripper = new JsonRipper();
                json_ripper.saveResource(resource, path.includes);
            }
            subject.next(resource);
            setTimeout(function () { return subject.complete(); }, 0);
        }, function (error) {
            resource.setLoadedAndPropagate(true);
            subject.next(resource);
            subject.error(error);
        });
    };
    /**
     * @template T
     * @return {?}
     */
    Service.prototype.getService = function () {
        return /** @type {?} */ ((Converter.getService(this.type) || this.register()));
    };
    /**
     * @param {?} path
     * @return {?}
     */
    Service.prototype.getOrCreateCollection = function (path) {
        /** @type {?} */
        var service = this.getService();
        /** @type {?} */
        var collection = /** @type {?} */ (CacheMemory.getInstance().getOrCreateCollection(path.getForCache()));
        collection.ttl = service.collections_ttl;
        if (collection.source !== 'new') {
            collection.source = 'memory';
        }
        return collection;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    Service.prototype.getOrCreateResource = function (id) {
        /** @type {?} */
        var service = this.getService();
        /** @type {?} */
        var resource;
        resource = /** @type {?} */ (CacheMemory.getInstance().getResource(this.type, id));
        if (resource === null) {
            resource = /** @type {?} */ (service.new());
            resource.id = id;
            CacheMemory.getInstance().setResource(resource, false);
        }
        if (resource.source !== 'new') {
            resource.source = 'memory';
        }
        return resource;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    Service.prototype.createResource = function (id) {
        /** @type {?} */
        var service = Converter.getServiceOrFail(this.type);
        /** @type {?} */
        var resource = service.new();
        resource.id = id;
        CacheMemory.getInstance().setResource(resource, false);
        return /** @type {?} */ (resource);
    };
    /**
     * deprecated since 2.2
     * @return {?}
     */
    Service.prototype.clearCacheMemory = function () {
        return __awaiter$4(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clearCache()];
            });
        });
    };
    /**
     * @return {?}
     */
    Service.prototype.clearCache = function () {
        return __awaiter$4(this, void 0, void 0, function () {
            var path, json_ripper;
            return __generator(this, function (_a) {
                path = new PathBuilder();
                path.applyParams(this);
                // @todo this code is repeated on core.clearCache()
                CacheMemory.getInstance().deprecateCollections(path.getForCache());
                json_ripper = new JsonRipper();
                return [2 /*return*/, json_ripper.deprecateCollection(path.getForCache()).then(function () { return true; })];
            });
        });
    };
    /**
     * @param {?} attributes
     * @return {?}
     */
    Service.prototype.parseToServer = function (attributes) {
        /* */
    };
    /**
     * @param {?} attributes
     * @return {?}
     */
    Service.prototype.parseFromServer = function (attributes) {
        /* */
    };
    /**
     * @param {?} id
     * @param {?=} params
     * @return {?}
     */
    Service.prototype.delete = function (id, params) {
        var _this = this;
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        var path = new PathBuilder();
        path.applyParams(this, params);
        path.appendPath(id);
        /** @type {?} */
        var subject = new Subject();
        Core.delete(path.get()).subscribe(function (success) {
            CacheMemory.getInstance().removeResource(_this.type, id);
            subject.next();
            subject.complete();
        }, function (error) {
            subject.error(error);
        });
        return subject.asObservable();
    };
    /**
     * @param {?=} params
     * @return {?}
     */
    Service.prototype.pathForAll = function (params) {
        if (params === void 0) { params = {}; }
        /** @type {?} */
        var builded_params = Object.assign({}, Base.ParamsCollection, params);
        /** @type {?} */
        var path = new PathCollectionBuilder();
        path.applyParams(this, builded_params);
        return path.get();
    };
    /**
     * @param {?=} params
     * @return {?}
     */
    Service.prototype.all = function (params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        /** @type {?} */
        var builded_params = Object.assign({}, Base.ParamsCollection, params);
        if (!builded_params.ttl && builded_params.ttl !== 0) {
            builded_params.ttl = this.collections_ttl;
        }
        /** @type {?} */
        var path = new PathCollectionBuilder();
        path.applyParams(this, builded_params);
        /** @type {?} */
        var temporary_collection = this.getOrCreateCollection(path);
        temporary_collection.page.number = builded_params.page.number * 1;
        /** @type {?} */
        var subject = new BehaviorSubject(temporary_collection);
        if (Object.keys(builded_params.fields).length > 0) {
            // memory/store cache dont suppont fields
            this.getAllFromServer(path, builded_params, temporary_collection, subject);
        }
        else if (isLive(temporary_collection, builded_params.ttl)) {
            // data on memory and its live
            setTimeout(function () { return subject.complete(); }, 0);
        }
        else if (temporary_collection.cache_last_update === 0) {
            // we dont have any data on memory
            temporary_collection.source = 'new';
            this.getAllFromLocal(builded_params, path, temporary_collection)
                .then(function () {
                subject.next(temporary_collection);
                setTimeout(function () {
                    subject.complete();
                }, 0);
            })
                .catch(function () {
                temporary_collection.setLoaded(false);
                _this.getAllFromServer(path, builded_params, temporary_collection, subject);
            });
        }
        else {
            this.getAllFromServer(path, builded_params, temporary_collection, subject);
        }
        return subject.asObservable();
    };
    /**
     * @param {?=} params
     * @param {?=} path
     * @param {?=} temporary_collection
     * @return {?}
     */
    Service.prototype.getAllFromLocal = function (params, path, temporary_collection) {
        if (params === void 0) { params = {}; }
        return __awaiter$4(this, void 0, void 0, function () {
            var success, json_ripper;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // STORE
                        if (!Core.injectedServices.rsJsonapiConfig.cachestore_support) {
                            throw new Error('We cant handle this request');
                        }
                        temporary_collection.setLoaded(false);
                        if (!(params.store_cache_method === 'compact')) return [3 /*break*/, 2];
                        return [4 /*yield*/, Core.injectedServices.JsonapiStoreService.getDataObject('collection', path.getForCache() + '.compact')];
                    case 1:
                        // STORE (compact)
                        success = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        json_ripper = new JsonRipper();
                        return [4 /*yield*/, json_ripper.getCollection(path.getForCache(), path.includes)];
                    case 3:
                        success = _a.sent();
                        _a.label = 4;
                    case 4:
                        temporary_collection.fill(success);
                        temporary_collection.setSourceAndPropagate('store');
                        // when fields is set, get resource form server
                        if (isLive(temporary_collection, params.ttl)) {
                            temporary_collection.setLoadedAndPropagate(true);
                            temporary_collection.setBuildedAndPropagate(true);
                            return [2 /*return*/];
                        }
                        throw new Error('Collection is dead!');
                }
            });
        });
    };
    /**
     * @param {?} path
     * @param {?} params
     * @param {?} temporary_collection
     * @param {?} subject
     * @return {?}
     */
    Service.prototype.getAllFromServer = function (path, params, temporary_collection, subject) {
        temporary_collection.setLoaded(false);
        Core.get(path.get()).subscribe(function (success) {
            // this create a new ID for every resource (for caching proposes)
            // for example, two URL return same objects but with different attributes
            // tslint:disable-next-line:deprecation
            if (params.cachehash) {
                for (var key in success.data) {
                    /** @type {?} */
                    var resource = success.data[key];
                    // tslint:disable-next-line:deprecation
                    resource.id = resource.id + params.cachehash;
                }
            }
            temporary_collection.fill(/** @type {?} */ (success));
            temporary_collection.cache_last_update = Date.now();
            temporary_collection.setCacheLastUpdateAndPropagate();
            temporary_collection.setSourceAndPropagate('server');
            temporary_collection.setLoadedAndPropagate(true);
            // this.getService().cachememory.setCollection(path.getForCache(), temporary_collection);
            if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
                /** @type {?} */
                var json_ripper = new JsonRipper();
                json_ripper.saveCollection(path.getForCache(), temporary_collection, path.includes);
            }
            if (Core.injectedServices.rsJsonapiConfig.cachestore_support && params.store_cache_method === 'compact') {
                // @todo migrate to dexie
                Core.injectedServices.JsonapiStoreService.saveCollection(path.getForCache() + '.compact', /** @type {?} */ ((success)));
            }
            subject.next(temporary_collection);
            setTimeout(function () { return subject.complete(); }, 0);
        }, function (error) {
            temporary_collection.setLoadedAndPropagate(true);
            subject.next(temporary_collection);
            subject.error(error);
        });
    };
    return Service;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Author = /** @class */ (function (_super) {
    __extends(Author, _super);
    function Author() {
        var _this = _super.call(this) || this;
        _this.attributes = {
            name: '',
            date_of_birth: new Date(),
            date_of_death: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        };
        _this.relationships = {
            books: new DocumentCollection(),
            photos: new DocumentCollection()
        };
        _this.type = 'authors';
        _this.ttl = 0;
        if (Author.test_ttl || Author.test_ttl === 0) {
            _this.ttl = Author.test_ttl;
        }
        return _this;
    }
    return Author;
}(Resource));
var AuthorsService = /** @class */ (function (_super) {
    __extends(AuthorsService, _super);
    function AuthorsService() {
        var _this = _super.call(this) || this;
        _this.resource = Author;
        _this.type = 'authors';
        _this.collections_ttl = 0;
        _this.register();
        return _this;
    }
    return AuthorsService;
}(Service));
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Book = /** @class */ (function (_super) {
    __extends(Book, _super);
    function Book() {
        var _this = _super.call(this) || this;
        _this.attributes = {
            date_published: new Date(),
            title: '',
            created_at: new Date(),
            updated_at: new Date()
        };
        _this.relationships = {
            author: new DocumentResource(),
            photos: new DocumentCollection()
        };
        _this.type = 'books';
        _this.ttl = 0;
        if (Book.test_ttl || Book.test_ttl === 0) {
            _this.ttl = Book.test_ttl;
        }
        return _this;
    }
    return Book;
}(Resource));
var BooksService = /** @class */ (function (_super) {
    __extends(BooksService, _super);
    function BooksService() {
        var _this = _super.call(this) || this;
        _this.type = 'books';
        _this.resource = Book;
        _this.collections_ttl = 0;
        _this.register();
        return _this;
    }
    return BooksService;
}(Service));
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Photo = /** @class */ (function (_super) {
    __extends(Photo, _super);
    function Photo() {
        var _this = _super.call(this) || this;
        _this.attributes = {
            title: '',
            uri: '',
            imageable_id: '',
            created_at: new Date(),
            updated_at: new Date()
        };
        _this.type = 'photos';
        _this.ttl = 0;
        if (Photo.test_ttl || Photo.test_ttl === 0) {
            _this.ttl = Photo.test_ttl;
        }
        return _this;
    }
    return Photo;
}(Resource));
var PhotosService = /** @class */ (function (_super) {
    __extends(PhotosService, _super);
    function PhotosService() {
        var _this = _super.call(this) || this;
        _this.resource = Photo;
        _this.type = 'photos';
        _this.register();
        return _this;
    }
    return PhotosService;
}(Service));
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TestFactory = /** @class */ (function () {
    function TestFactory() {
    }
    /**
     * @param {?} document_class
     * @param {?=} include
     * @param {?=} id
     * @return {?}
     */
    TestFactory.getResourceDocumentData = function (document_class, include, id) {
        if (include === void 0) { include = []; }
        /** @type {?} */
        var main_resource = this["get" + document_class.name](id, include);
        /** @type {?} */
        var document_data = main_resource.toObject();
        TestFactory.fillDocumentDataIncludedRelatioships(document_data, include);
        return document_data;
    };
    /**
     * @param {?} document_class
     * @param {?=} size
     * @param {?=} include
     * @return {?}
     */
    TestFactory.getCollectionDocumentData = function (document_class, size, include) {
        if (size === void 0) { size = 2; }
        if (include === void 0) { include = []; }
        /** @type {?} */
        var main_collection = this.getCollection(document_class, size, include);
        /** @type {?} */
        var document_data = main_collection.toObject();
        TestFactory.fillDocumentDataIncludedRelatioships(document_data, include);
        return document_data;
    };
    /**
     * @return {?}
     */
    TestFactory.getBookDocumentData = function () {
        /**/
    };
    /**
     * @return {?}
     */
    TestFactory.getPhotoDocumentData = function () {
        /**/
    };
    /**
     * @param {?=} id
     * @param {?=} include
     * @param {?=} ttl
     * @return {?}
     */
    TestFactory.getBook = function (id, include, ttl) {
        if (include === void 0) { include = []; }
        if (ttl === void 0) { ttl = 0; }
        /** @type {?} */
        var book = new Book();
        book.id = this.getId(id);
        book.ttl = ttl;
        TestFactory.fillBookAttributes(book);
        // NOTE: add author
        ( /** @type {?} */(book.relationships.author.data)) = this.getDataResourceWithType('authors');
        if (include.includes('author')) {
            this.includeFromService(book, 'author', Author);
        }
        // NOTE: add photos
        book.relationships.photos.data = book.relationships.photos.data.concat(/** @type {?} */ (this.getDataResourcesWithType('photos', 2)));
        if (include.includes('photos')) {
            this.includeFromService(book, 'photos', Photo);
        }
        return book;
    };
    /**
     * @param {?=} id
     * @param {?=} include
     * @param {?=} ttl
     * @return {?}
     */
    TestFactory.getAuthor = function (id, include, ttl) {
        if (include === void 0) { include = []; }
        if (ttl === void 0) { ttl = 0; }
        /** @type {?} */
        var author = new Author();
        author.id = this.getId(id);
        author.ttl = ttl;
        TestFactory.fillAuthorAttributes(author);
        // NOTE: add books
        author.relationships.books.data = author.relationships.books.data.concat(/** @type {?} */ (this.getDataResourcesWithType('books', 2)));
        if (include.includes('books')) {
            this.includeFromService(author, 'books', Book);
            for (var _i = 0, _a = author.relationships.books.data; _i < _a.length; _i++) {
                var book = _a[_i];
                ( /** @type {?} */(book.relationships.author.data)).id = author.id;
            }
        }
        // NOTE: add photos
        author.relationships.photos.data = author.relationships.photos.data.concat(/** @type {?} */ ((this.getDataResourcesWithType('photos', 2))));
        if (include.includes('photos')) {
            this.includeFromService(author, 'photos', Photo);
        }
        return author;
    };
    /**
     * @param {?=} id
     * @param {?=} include
     * @param {?=} ttl
     * @return {?}
     */
    TestFactory.getPhoto = function (id, include, ttl) {
        if (include === void 0) { include = []; }
        if (ttl === void 0) { ttl = 0; }
        /** @type {?} */
        var photo = new Photo();
        photo.id = this.getId(id);
        photo.ttl = ttl;
        TestFactory.fillPhotoAttirbutes(photo);
        return photo;
    };
    /**
     * @param {?} resources_class
     * @param {?=} size
     * @param {?=} include
     * @return {?}
     */
    TestFactory.getCollection = function (resources_class, size, include) {
        if (size === void 0) { size = 2; }
        if (include === void 0) { include = []; }
        /** @type {?} */
        var collection = new DocumentCollection();
        for (var index = 0; index < size; index++) {
            /** @type {?} */
            var factory_name = "get" + resources_class.name;
            /** @type {?} */
            var resource = this[factory_name](undefined, include);
            collection.data.push(resource);
        }
        collection.setBuilded(true);
        collection.setLoaded(true);
        collection.cache_last_update = Date.now();
        return collection;
    };
    /**
     * @param {?} author
     * @return {?}
     */
    TestFactory.fillAuthorAttributes = function (author) {
        author.attributes.name = name.firstName();
        author.attributes.date_of_birth = date.past();
        author.attributes.date_of_death = date.past();
        author.attributes.created_at = date.past();
        author.attributes.updated_at = date.past();
        return author;
    };
    /**
     * @param {?} book
     * @return {?}
     */
    TestFactory.fillBookAttributes = function (book) {
        book.attributes.title = name.title();
        book.attributes.date_published = date.past();
        book.attributes.created_at = date.past();
        book.attributes.updated_at = date.past();
        return book;
    };
    /**
     * @param {?} book
     * @return {?}
     */
    TestFactory.fillPhotoAttirbutes = function (book) {
        book.attributes.title = name.title();
        book.attributes.uri = internet.url();
        book.attributes.imageable_id = random.uuid();
        book.attributes.created_at = date.past();
        book.attributes.updated_at = date.past();
        return book;
    };
    /**
     * @param {?=} id
     * @return {?}
     */
    TestFactory.getId = function (id) {
        return id || 'new_' + Math.floor(Math.random() * 10000).toString();
    };
    /**
     * @param {?} resource
     * @param {?} relationship_alias
     * @param {?} class_to_add
     * @return {?}
     */
    TestFactory.includeFromService = function (resource, relationship_alias, class_to_add) {
        /** @type {?} */
        var relationship = resource.relationships[relationship_alias];
        if (!relationship) {
            console.error(relationship_alias + " relationship doesn't exist in " + resource.type);
            return;
        }
        else if (relationship.data && 'id' in relationship.data) {
            this.includeHasOneFromService(resource, relationship_alias, class_to_add);
        }
        else if (relationship instanceof DocumentCollection) {
            this.includeHasManyFromService(resource, relationship_alias, class_to_add);
        }
    };
    /**
     * @param {?} resource
     * @param {?} relationship_alias
     * @param {?} class_to_add
     * @return {?}
     */
    TestFactory.includeHasOneFromService = function (resource, relationship_alias, class_to_add) {
        /** @type {?} */
        var resource_to_add = new class_to_add();
        /** @type {?} */
        var relationship = /** @type {?} */ (resource.relationships[relationship_alias]);
        if (!relationship || !relationship.data) {
            return;
        }
        resource_to_add.id = relationship.data.id;
        /** @type {?} */
        var fill_method = "fill" + class_to_add.name + "Attributes";
        TestFactory[fill_method](resource_to_add);
        resource.addRelationship(resource_to_add, relationship_alias);
    };
    /**
     * @param {?} resource
     * @param {?} relationship_alias
     * @param {?} class_to_add
     * @return {?}
     */
    TestFactory.includeHasManyFromService = function (resource, relationship_alias, class_to_add) {
        /** @type {?} */
        var resources_to_add = [];
        for (var _i = 0, _a = ( /** @type {?} */(resource.relationships[relationship_alias])).data; _i < _a.length; _i++) {
            var resource_relatioship = _a[_i];
            /** @type {?} */
            var resource_to_add = new class_to_add();
            resource_to_add.id = resource_relatioship.id;
            /** @type {?} */
            var fill_method = "fill" + class_to_add.name + "Attributes";
            TestFactory[fill_method](resource_to_add);
            resources_to_add.push(resource_to_add);
        }
        // @TODO: cannot use addRelationships because its not working here... SHOULD BE FIXED
        // resource.addRelationships(resources_to_add, relationship_alias);
        resource.relationships[relationship_alias].data = resources_to_add;
    };
    /**
     * @param {?} type
     * @param {?=} id
     * @return {?}
     */
    TestFactory.getDataResourceWithType = function (type, id) {
        return {
            id: this.getId(id),
            type: type
        };
    };
    /**
     * @param {?} type
     * @param {?} qty
     * @return {?}
     */
    TestFactory.getDataResourcesWithType = function (type, qty) {
        /** @type {?} */
        var data_resources = [];
        for (var index = 0; index < qty; index++) {
            data_resources.push(this.getDataResourceWithType(type));
        }
        return data_resources;
    };
    /**
     * @param {?} document_data
     * @param {?} resource
     * @param {?} included_alias
     * @return {?}
     */
    TestFactory.fillResourceRelationshipsInDocumentData = function (document_data, resource, included_alias) {
        if (!document_data.included) {
            document_data.included = [];
        }
        /** @type {?} */
        var relationship_content = resource.relationships[included_alias];
        // @NOTE: cannot check IDocumentResource interface with instanceof
        if (relationship_content instanceof DocumentResource || 'type' in relationship_content.data) {
            /** @type {?} */
            var relation_data = ( /** @type {?} */(relationship_content)).data;
            if (!relation_data) {
                console.warn('relationship content is empty');
                return;
            }
            /** @type {?} */
            var resource_class = TestFactory.resource_classes_by_type[relation_data.type];
            if (!resource_class) {
                console.warn("cannot find the required class for type " + relation_data.type);
                return;
            }
            document_data.included.push(
            // @TODO: improve this code... should avoid forced types and ts errors...
            this["get" + resource_class.name](relation_data.id));
            // @NOTE: cannot check IDataResource interface with instanceof
        }
        else if (relationship_content instanceof DocumentCollection || relationship_content.data instanceof Array) {
            for (var _i = 0, _a = ( /** @type {?} */(resource.relationships[included_alias])).data; _i < _a.length; _i++) {
                var has_many_relationship = _a[_i];
                document_data.included.push(this["get" + TestFactory.resource_classes_by_type[has_many_relationship.type].name](has_many_relationship.id));
            }
        }
    };
    /**
     * @param {?} document_data
     * @param {?} include
     * @return {?}
     */
    TestFactory.fillDocumentDataIncludedRelatioships = function (document_data, include) {
        for (var _i = 0, include_1 = include; _i < include_1.length; _i++) {
            var included_alias = include_1[_i];
            if (!document_data.included) {
                document_data.included = [];
            }
            if (( /** @type {?} */(document_data.data)).id) {
                if (!( /** @type {?} */(document_data.data)).relationships[included_alias].data) {
                    continue;
                }
                TestFactory.fillResourceRelationshipsInDocumentData(document_data, /** @type {?} */ (document_data.data), included_alias);
                return;
            }
            for (var _a = 0, /** @type {?} */ _b = (document_data.data); _a < _b.length; _a++) {
                var resource = _b[_a];
                TestFactory.fillResourceRelationshipsInDocumentData(document_data, resource, included_alias);
            }
        }
    };
    return TestFactory;
}());
TestFactory.resource_classes_by_type = {
    photos: Photo,
    books: Book,
    authors: Author
};
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
export { Autoregister, Core as JsonapiCore, Resource, DocumentResource, DocumentCollection, Service, Author, AuthorsService, Book, BooksService, Photo, PhotosService, TestFactory, NgxJsonapiModule, Document as ɵe, RelatedDocumentCollection as ɵa, JsonapiConfig as ɵb, Http as ɵd, StoreService as ɵc };
//# sourceMappingURL=ngx-jsonapi.es5.js.map
