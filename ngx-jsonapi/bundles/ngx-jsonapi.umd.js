(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/common/http'), require('rxjs/operators'), require('localforage'), require('localforage-getitems'), require('util'), require('rxjs'), require('rxjs/internal/util/noop')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/common/http', 'rxjs/operators', 'localforage', 'localforage-getitems', 'util', 'rxjs', 'rxjs/internal/util/noop'], factory) :
	(factory((global['ngx-jsonapi'] = {}),global.ng.core,global.common,global.http,global.operators,global.localForage,global.localforageGetitems,global.util,global.rxjs,global.noop$1));
}(this, (function (exports,core,common,http,operators,localForage,localforageGetitems,util,rxjs,noop$1) { 'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
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
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var JsonapiConfig = /** @class */ (function () {
    function JsonapiConfig() {
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
    return JsonapiConfig;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Http = /** @class */ (function () {
    /**
     * @param {?} http
     * @param {?} rsJsonapiConfig
     */
    function Http(http$$1, rsJsonapiConfig) {
        this.http = http$$1;
        this.rsJsonapiConfig = rsJsonapiConfig;
    }
    /**
     * @param {?} path
     * @param {?} method
     * @param {?=} data
     * @return {?}
     */
    Http.prototype.exec = function (path, method, data) {
        /** @type {?} */
        var req = {
            body: data || null,
            headers: new http.HttpHeaders({
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json'
            })
        };
        /** @type {?} */
        var obs = this.http.request(method, path, req);
        if (method === 'get') {
            obs.pipe(operators.share());
        }
        return obs;
    };
    return Http;
}());
Http.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
Http.ctorParameters = function () { return [
    { type: http.HttpClient },
    { type: JsonapiConfig }
]; };
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
var Document = /** @class */ (function () {
    function Document() {
        this.builded = false;
        this.is_loading = true;
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
var PathBuilder = /** @class */ (function () {
    function PathBuilder() {
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
     * @param {?} value
     * @return {?}
     */
    PathBuilder.prototype.setApiBaseUrl = function (value) {
        if (value !== '') {
            this.apiBaseUrl = value;
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
        return this.apiBaseUrl + this.paths.join('/') + (params.length > 0 ? Core.injectedServices.rsJsonapiConfig.params_separator + params.join('&') : '');
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
var DocumentResource = /** @class */ (function (_super) {
    __extends(DocumentResource, _super);
    function DocumentResource() {
        var _this = _super.apply(this, arguments) || this;
        _this.data = /** @type {?} */ (new Resource());
        _this.builded = false;
        _this.content = 'id';
        _this.page = new Page();
        return _this;
    }
    /**
     * @param {?} data_resource
     * @return {?}
     */
    DocumentResource.prototype.fill = function (data_resource) {
        this.data_resource = data_resource;
        this.data.fill(data_resource);
        this.meta = data_resource.meta || {};
    };
    return DocumentResource;
}(Document));
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
    };
    /**
     * @param {?} relation_from_value
     * @param {?} relation_alias
     * @return {?}
     */
    ResourceRelationshipsConverter.prototype.__buildRelationshipHasMany = function (relation_from_value, relation_alias) {
        /** @type {?} */
        var relation_type = relation_from_value.data[0] ? relation_from_value.data[0].type : '';
        if (relation_type === '') {
            return;
        }
        relation_alias = relation_alias || relation_type;
        if (!this.getService(relation_type)) {
            if (core.isDevMode()) {
                console.warn('The relationship ' + relation_alias + ' (type', relation_type, ') cant be generated because service for this type has not been injected.');
            }
            return;
        }
        if (relation_from_value.data.length === 0) {
            this.relationships_dest[relation_alias] = new DocumentCollection();
            return;
        }
        ( /** @type {?} */(this.relationships_dest[relation_alias])).fill(relation_from_value, this.included_resources);
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
        if (relation_data_from.data.id !== ( /** @type {?} */(this.relationships_dest[relation_alias].data)).id) {
            this.relationships_dest[relation_alias].data = new Resource();
        }
        if (( /** @type {?} */(this.relationships_dest[relation_alias].data)).id !== relation_data_from.data.id) {
            /** @type {?} */
            var resource_data = this.__buildRelationship(relation_data_from.data, this.included_resources);
            if (resource_data) {
                this.relationships_dest[relation_alias].data = resource_data;
                this.relationships_dest[relation_alias].builded = true;
            }
        }
    };
    /**
     * @param {?} resource_data_from
     * @param {?} included_array
     * @return {?}
     */
    ResourceRelationshipsConverter.prototype.__buildRelationship = function (resource_data_from, included_array) {
        if (resource_data_from.type in included_array && resource_data_from.id in included_array[resource_data_from.type]) {
            /** @type {?} */
            var data = included_array[resource_data_from.type][resource_data_from.id];
            // Store the include in cache
            this.getService(resource_data_from.type).cachestore.setResource(data);
            return data;
        }
        else {
            /** @type {?} */
            var service = this.getService(resource_data_from.type);
            if (service && resource_data_from.id in service.cachememory.resources) {
                return service.cachememory.resources[resource_data_from.id];
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
        var included_ids = []; // just for control don't repeat any resource
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
                var relationship_data = /** @type {?} */ (relationship.data);
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
                var temporal_id = relationship_data.type + '_' + relationship_data.id;
                if (included_ids.indexOf(temporal_id) === -1 && params.include.indexOf(relation_alias) !== -1) {
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
            },
            builded: false,
            content: 'resource'
        };
        if (included.length > 0) {
            ret.included = included;
        }
        return ret;
    };
    /**
     * @param {?} data_object
     * @param {?=} included_resources
     * @return {?}
     */
    Resource.prototype.fill = function (data_object, included_resources) {
        included_resources = included_resources || Converter.buildIncluded(data_object);
        this.id = data_object.data.id || '';
        this.attributes = data_object.data.attributes || this.attributes;
        this.data_resource = data_object;
        this.is_new = false;
        /** @type {?} */
        var service = Converter.getService(data_object.data.type);
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
     * @deprecated
     * @template R
     * @param {?} resources
     * @param {?} type_alias
     * @return {?}
     */
    Resource.prototype.addRelationshipsArray = function (resources, type_alias) {
        this.addRelationships(resources, type_alias);
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
        }
        else {
            relation.data.reset();
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
        return (this.relationships[resource] &&
            ( /** @type {?} */(this.relationships[resource].data)).type &&
            ( /** @type {?} */(this.relationships[resource].data)).type !== '');
    };
    /**
     * @return {?}
     */
    Resource.prototype.getService = function () {
        return Converter.getService(this.type);
    };
    /**
     * @template T
     * @param {?=} params
     * @return {?}
     */
    Resource.prototype.save = function (params) {
        var _this = this;
        params = Object.assign({}, Base.ParamsResource, params);
        if (this.is_saving || this.is_loading) {
            return rxjs.of({});
        }
        this.is_saving = true;
        /** @type {?} */
        var subject = new rxjs.Subject();
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
        Core.exec(path.get(), this.id ? 'PATCH' : 'POST', object, true).subscribe(function (success) {
            _this.is_saving = false;
            // foce reload cache (for example, we add a new element)
            if (!_this.id) {
                _this.getService().cachememory.deprecateCollections(path.get());
                _this.getService().cachestore.deprecateCollections(path.get());
            }
            // is a resource?
            if ('id' in success.data) {
                _this.id = success.data.id;
                _this.fill(/** @type {?} */ (success));
            }
            else if (util.isArray(success.data)) {
                console.warn('Server return a collection when we save()', success.data);
            }
            subject.next(success);
            subject.complete();
        }, function (error) {
            _this.is_saving = false;
            subject.error('data' in error ? error.data : error);
        });
        return subject;
    };
    return Resource;
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
            if (core.isDevMode()) {
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
     * @param {?} document_from
     * @return {?}
     */
    Converter.buildIncluded = function (document_from) {
        if ('included' in document_from) {
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
        var resource;
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
// unsupported: template constraints.
/**
 * @template R
 */
var DocumentCollection = /** @class */ (function (_super) {
    __extends(DocumentCollection, _super);
    function DocumentCollection() {
        var _this = _super.apply(this, arguments) || this;
        _this.data = [];
        _this.page = new Page();
        return _this;
    }
    /**
     * @param {?} iterated_resource
     * @return {?}
     */
    DocumentCollection.prototype.trackBy = function (iterated_resource) {
        return iterated_resource.id;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    DocumentCollection.prototype.find = function (id) {
        // this is the best way: https://jsperf.com/fast-array-foreach
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].id === id) {
                return this.data[i];
            }
        }
        return null;
    };
    /**
     * @param {?} data_collection
     * @param {?=} included_resources
     * @return {?}
     */
    DocumentCollection.prototype.fill = function (data_collection, included_resources) {
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
        var new_ids = {};
        this.data = [];
        this.builded = data_collection.data && data_collection.data.length === 0;
        for (var _i = 0, _a = data_collection.data; _i < _a.length; _i++) {
            var dataresource = _a[_i];
            /** @type {?} */
            var res = this.find(dataresource.id) || Converter.getService(dataresource.type).getOrCreateResource(dataresource.id);
            res.fill({ data: dataresource }, included_resources); // @todo check with included resources?
            new_ids[dataresource.id] = dataresource.id;
            this.data.push(/** @type {?} */ (res));
            if (Object.keys(res.attributes).length > 0) {
                this.builded = true;
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
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    DocumentCollection.prototype.replaceOrAdd = function (resource) {
        /** @type {?} */
        var res = this.find(resource.id);
        if (res === null) {
            this.data.push(resource);
        }
        else {
            res = resource;
        }
    };
    /**
     * @return {?}
     */
    DocumentCollection.prototype.hasMorePages = function () {
        if (this.page.size < 1) {
            return null;
        }
        /** @type {?} */
        var total_resources = this.page.size * (this.page.number - 1) + this.data.length;
        return total_resources < this.page.total_resources;
    };
    return DocumentCollection;
}(Document));
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
localforageGetitems.extendPrototype(localForage);
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
var StoreService = /** @class */ (function () {
    function StoreService() {
        if (this.globalstore)
            this.checkIfIsTimeToClean();
    }
    /**
     * @param {?} type
     * @param {?} id_or_url
     * @return {?}
     */
    StoreService.prototype.getDataObject = function (type, id_or_url) {
        /** @type {?} */
        var subject = new rxjs.Subject();
        this.allstore
            .getItem('jsonapi.' + type + '.' + id_or_url)
            .then(function (success) {
            if (success === null) {
                subject.error(null);
            }
            else {
                subject.next(success);
            }
            subject.complete();
        })
            .catch(function (error) { return subject.next(error); });
        return subject.asObservable();
    };
    /**
     * @param {?} keys
     * @return {?}
     */
    StoreService.prototype.getDataResources = function (keys) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.allstore.getItems(keys.map(function (key) { return 'jsonapi.' + key; }))];
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
        /** @type {?} */
        var data_resource_storage = Object.assign({ _lastupdate_time: Date.now() }, value);
        this.allstore.setItem('jsonapi.' + type + '.' + url_or_id, data_resource_storage);
    };
    /**
     * @param {?} url_or_id
     * @param {?} value
     * @return {?}
     */
    StoreService.prototype.saveCollection = function (url_or_id, value) {
        /** @type {?} */
        var data_collection_storage = Object.assign({ _lastupdate_time: Date.now() }, value);
        this.allstore.setItem('jsonapi.collection.' + url_or_id, data_collection_storage);
    };
    /**
     * @return {?}
     */
    StoreService.prototype.clearCache = function () {
        this.allstore.clear();
        this.globalstore.clear();
    };
    /**
     * @param {?} key_start_with
     * @return {?}
     */
    StoreService.prototype.deprecateObjectsWithKey = function (key_start_with) {
        var _this = this;
        this.allstore
            .keys()
            .then(function (success) {
            Base.forEach(success, function (key) {
                if (key.startsWith(key_start_with)) {
                    // key of stored object starts with key_start_with
                    _this.allstore
                        .getItem(key)
                        .then(function (success2) {
                        success2._lastupdate_time = 0;
                        _this.allstore.setItem(key, success2);
                    })
                        .catch(rxjs.noop);
                }
            });
        })
            .catch(rxjs.noop);
    };
    /**
     * @return {?}
     */
    StoreService.prototype.checkIfIsTimeToClean = function () {
        var _this = this;
        // check if is time to check cachestore
        this.globalstore
            .getItem('_lastclean_time')
            .then(function (success) {
            if (Date.now() >= success.time + 12 * 3600 * 1000) {
                // is time to check cachestore!
                _this.globalstore.setItem('_lastclean_time', {
                    time: Date.now()
                });
                _this.checkAndDeleteOldElements();
            }
        })
            .catch(function () {
            _this.globalstore.setItem('_lastclean_time', {
                time: Date.now()
            });
        });
    };
    /**
     * @return {?}
     */
    StoreService.prototype.checkAndDeleteOldElements = function () {
        var _this = this;
        this.allstore
            .keys()
            .then(function (success) {
            Base.forEach(success, function (key) {
                // recorremos cada item y vemos si es tiempo de removerlo
                _this.allstore
                    .getItem(key)
                    .then(function (success2) {
                    if (Date.now() >= success2._lastupdate_time + 24 * 3600 * 1000) {
                        _this.allstore.removeItem(key);
                    }
                })
                    .catch(rxjs.noop);
            });
        })
            .catch(rxjs.noop);
    };
    return StoreService;
}());
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
        this.loadingsStart = noop$1.noop;
        this.loadingsDone = noop$1.noop;
        this.loadingsError = noop$1.noop;
        this.loadingsOffline = noop$1.noop;
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
        operators.tap(function () { return Core.me.refreshLoadings(-1); }), operators.catchError(function (error) {
            error = error.error || error;
            Core.me.refreshLoadings(-1);
            if (error.status <= 0) {
                // offline?
                if (!Core.me.loadingsOffline(error) && core.isDevMode()) {
                    console.warn('Jsonapi.Http.exec (use JsonapiCore.loadingsOffline for catch it) error =>', error);
                }
            }
            else if (call_loadings_error && !Core.me.loadingsError(error) && core.isDevMode()) {
                console.warn('Jsonapi.Http.exec (use JsonapiCore.loadingsError for catch it) error =>', error);
            }
            return rxjs.throwError(error);
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
        Core.injectedServices.JsonapiStoreService.clearCache();
        return true;
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
        var newresource = /** @type {?} */ (this.getResourceService(resource.type).new());
        newresource.attributes = Object.assign({}, newresource.attributes, resource.attributes);
        var _loop_1 = function (alias) {
            /** @type {?} */
            var relationship = resource.relationships[alias];
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
                    Object.values(relationship.data).forEach(function (relationresource) {
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
    { type: core.Injectable },
];
/** @nocollapse */
Core.ctorParameters = function () { return [
    { type: JsonapiConfig, decorators: [{ type: core.Optional }] },
    { type: StoreService },
    { type: Http }
]; };
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
    { type: core.NgModule, args: [{
                imports: [common.CommonModule],
                exports: [
                    http.HttpClientModule
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
    { type: NgxJsonapiModule, decorators: [{ type: core.Optional }, { type: core.SkipSelf }] },
    { type: Core }
]; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @return {?}
 */
function Autoregister() {
    return function (target) {
        /** @type {?} */
        var original = target;
        /** @type {?} */
        var newConstructor = function newCtor() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            /** @type {?} */
            var c = function childConstuctor() {
                return original.apply(this, arguments);
            };
            c.prototype = Object.create(original.prototype);
            /** @type {?} */
            var instance = new (c.bind.apply(c, [void 0].concat(args)))();
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
var CacheMemory = /** @class */ (function () {
    function CacheMemory() {
        this.resources = {};
        this.collections = {};
        this.collections_lastupdate = {};
    }
    /**
     * @param {?} url
     * @return {?}
     */
    CacheMemory.prototype.isCollectionExist = function (url) {
        return url in this.collections && this.collections[url].source !== 'new' ? true : false;
    };
    /**
     * @param {?} url
     * @param {?} ttl
     * @return {?}
     */
    CacheMemory.prototype.isCollectionLive = function (url, ttl) {
        return Date.now() <= this.collections_lastupdate[url] + ttl * 1000;
    };
    /**
     * @param {?} id
     * @param {?} ttl
     * @return {?}
     */
    CacheMemory.prototype.isResourceLive = function (id, ttl) {
        return this.resources[id] && Date.now() <= this.resources[id].lastupdate + ttl * 1000;
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
            this.setResource(resource);
        }
        this.collections[url].data = collection.data;
        this.collections[url].page = collection.page;
        this.collections_lastupdate[url] = Date.now();
    };
    /**
     * @param {?} type
     * @param {?} id
     * @return {?}
     */
    CacheMemory.prototype.getOrCreateResource = function (type, id) {
        if (Converter.getService(type).cachememory && id in Converter.getService(type).cachememory.resources) {
            return Converter.getService(type).cachememory.resources[id];
        }
        else {
            /** @type {?} */
            var resource = Converter.getService(type).new();
            resource.id = id;
            // needed for a lot of request (all and get, tested on multinexo.com)
            this.setResource(resource, false);
            return resource;
        }
    };
    /**
     * @param {?} resource
     * @param {?=} update_lastupdate
     * @return {?}
     */
    CacheMemory.prototype.setResource = function (resource, update_lastupdate) {
        if (update_lastupdate === void 0) { update_lastupdate = false; }
        if (resource.id in this.resources) {
            this.addResourceOrFill(resource);
        }
        else {
            this.resources[resource.id] = resource;
        }
        this.resources[resource.id].lastupdate = update_lastupdate ? Date.now() : 0;
    };
    /**
     * @param {?} path_start_with
     * @return {?}
     */
    CacheMemory.prototype.deprecateCollections = function (path_start_with) {
        var _this = this;
        Base.forEach(this.collections_lastupdate, function (lastupdate, key) {
            _this.collections_lastupdate[key] = 0;
        });
        return true;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    CacheMemory.prototype.removeResource = function (id) {
        Base.forEach(this.collections, function (value, url) {
            delete value[id];
        });
        this.resources[id].attributes = {}; // just for confirm deletion on view
        // this.resources[id].relationships = {}; // just for confirm deletion on view
        for (var relationship in this.resources[id].relationships) {
            if (this.resources[id].relationships[relationship].data.constructor === Array) {
                this.resources[id].relationships[relationship].data = []; // just in case that there is a for loop using it
            }
            else if (this.resources[id].relationships[relationship].data.constructor === Object) {
                delete this.resources[id].relationships[relationship].data;
            }
        }
        delete this.resources[id];
    };
    /**
     * @param {?} source
     * @return {?}
     */
    CacheMemory.prototype.addResourceOrFill = function (source) {
        /** @type {?} */
        var destination = this.resources[source.id];
        destination.attributes = source.attributes;
        // remove relationships on destination resource
        for (var type_alias in destination.relationships) {
            // problem with no declared services
            if (destination.relationships[type_alias].data === undefined) {
                continue;
            }
            if (!(type_alias in source.relationships)) {
                delete destination.relationships[type_alias];
            }
            else {
                /** @type {?} */
                var collection = /** @type {?} */ (destination.relationships[type_alias]);
                // TODO: talkto Pablo, this could be and Object... (following IF statement added by Maxi)
                if (!Array.isArray(collection.data)) {
                    continue;
                }
                for (var _i = 0, _a = collection.data; _i < _a.length; _i++) {
                    var resource = _a[_i];
                    if (collection.find(resource.id) === null) {
                        delete destination.relationships[type_alias];
                    }
                }
            }
        }
        // add source relationships to destination
        for (var type_alias in source.relationships) {
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
    };
    return CacheMemory;
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
var CacheStore = /** @class */ (function () {
    function CacheStore() {
    }
    /**
     * @param {?} resource
     * @param {?=} include
     * @return {?}
     */
    CacheStore.prototype.getResource = function (resource, include) {
        if (include === void 0) { include = []; }
        return __awaiter$1(this, void 0, void 0, function () {
            var mypromise;
            var _this = this;
            return __generator(this, function (_a) {
                mypromise = new Promise(function (resolve, reject) {
                    Core.injectedServices.JsonapiStoreService.getDataObject(resource.type, resource.id).subscribe(function (success) {
                        resource.fill({ data: success });
                        /** @type {?} */
                        var include_promises = [];
                        for (var _i = 0, include_1 = include; _i < include_1.length; _i++) {
                            var resource_alias = include_1[_i];
                            _this.fillRelationshipFromStore(resource, resource_alias, include_promises);
                        }
                        // resource.lastupdate = success._lastupdate_time;
                        // no debo esperar a que se resuelvan los include
                        if (include_promises.length === 0) {
                            resolve(success);
                        }
                        else {
                            // esperamos las promesas de los include antes de dar el resolve
                            Promise.all(include_promises)
                                .then(function (success3) {
                                resolve(success3);
                            })
                                .catch(function (error3) {
                                reject(error3);
                            });
                        }
                    }, function () {
                        reject();
                    });
                });
                return [2 /*return*/, mypromise];
            });
        });
    };
    /**
     * @param {?} resource
     * @return {?}
     */
    CacheStore.prototype.setResource = function (resource) {
        Core.injectedServices.JsonapiStoreService.saveResource(resource.type, resource.id, resource.toObject().data);
    };
    /**
     * @param {?} url
     * @param {?} collection
     * @param {?} include
     * @return {?}
     */
    CacheStore.prototype.setCollection = function (url, collection, include) {
        var _this = this;
        /** @type {?} */
        var tmp = { data: [], page: new Page() };
        /** @type {?} */
        var resources_for_save = {};
        for (var _i = 0, _a = collection.data; _i < _a.length; _i++) {
            var resource = _a[_i];
            this.setResource(resource);
            tmp.data.push({ id: resource.id, type: resource.type });
            for (var _b = 0, include_2 = include; _b < include_2.length; _b++) {
                var resource_type_alias = include_2[_b];
                if ('id' in resource.relationships[resource_type_alias].data) {
                    /** @type {?} */
                    var ress = /** @type {?} */ (resource.relationships[resource_type_alias].data);
                    resources_for_save[resource_type_alias + ress.id] = ress;
                }
                else {
                    /** @type {?} */
                    var collection2 = /** @type {?} */ (resource.relationships[resource_type_alias].data);
                    for (var _c = 0, collection2_1 = collection2; _c < collection2_1.length; _c++) {
                        var inc_resource = collection2_1[_c];
                        resources_for_save[resource_type_alias + inc_resource.id] = inc_resource;
                    }
                }
            }
        }
        tmp.page = collection.page;
        Core.injectedServices.JsonapiStoreService.saveCollection(url, /** @type {?} */ (tmp));
        Base.forEach(resources_for_save, function (resource_for_save) {
            if (!('is_new' in resource_for_save)) {
                // console.warn('No se pudo guardar en la cache', resource_for_save.type, 'por no se ser Resource.', resource_for_save);
                return;
            }
            if (Object.keys(resource_for_save.attributes).length === 0) {
                console.warn('No se pudo guardar en la cache', resource_for_save.type, 'por no tener attributes.', resource_for_save);
                return;
            }
            _this.setResource(resource_for_save);
        });
    };
    /**
     * @param {?} path_start_with
     * @return {?}
     */
    CacheStore.prototype.deprecateCollections = function (path_start_with) {
        Core.injectedServices.JsonapiStoreService.deprecateObjectsWithKey('collection.' + path_start_with);
        return true;
    };
    /**
     * @param {?} url
     * @param {?} include
     * @param {?} collection
     * @return {?}
     */
    CacheStore.prototype.fillCollectionFromStore = function (url, include, collection) {
        var _this = this;
        /** @type {?} */
        var subject = new rxjs.Subject();
        Core.injectedServices.JsonapiStoreService.getDataObject('collection', url).subscribe(function (data_collection) {
            // build collection from store and resources from memory
            if (_this.fillCollectionWithArrrayAndResourcesOnMemory(data_collection.data, collection)) {
                collection.source = 'store'; // collection from storeservice, resources from memory
                collection.cache_last_update = data_collection._lastupdate_time;
                subject.next(collection);
                subject.complete();
                return;
            }
            /** @type {?} */
            var promise2 = _this.fillCollectionWithArrrayAndResourcesOnStore(data_collection, include, collection);
            promise2
                .then(function () {
                // just for precaution, we not rewrite server data
                if (collection.source !== 'new') {
                    console.warn('ts-angular-json: esto no debería pasar. buscar eEa2ASd2#', collection);
                    throw new Error('ts-angular-json: esto no debería pasar. buscar eEa2ASd2#');
                }
                collection.source = 'store'; // collection and resources from storeservice
                collection.cache_last_update = data_collection._lastupdate_time;
                subject.next(collection);
                setTimeout(function () { return subject.complete(); });
            })
                .catch(function (err) { return subject.error(err); });
        }, function (err) { return subject.error(err); });
        return subject;
    };
    /**
     * @param {?} dataresources
     * @param {?} collection
     * @return {?}
     */
    CacheStore.prototype.fillCollectionWithArrrayAndResourcesOnMemory = function (dataresources, collection) {
        /** @type {?} */
        var all_ok = true;
        for (var _i = 0, dataresources_1 = dataresources; _i < dataresources_1.length; _i++) {
            var dataresource = dataresources_1[_i];
            /** @type {?} */
            var resource = this.getResourceFromMemory(dataresource);
            if (resource.is_new) {
                all_ok = false;
                break;
            }
            collection.replaceOrAdd(resource);
        }
        return all_ok;
    };
    /**
     * @param {?} dataresource
     * @return {?}
     */
    CacheStore.prototype.getResourceFromMemory = function (dataresource) {
        /** @type {?} */
        var cachememory = Converter.getService(dataresource.type).cachememory;
        /** @type {?} */
        var resource = cachememory.getOrCreateResource(dataresource.type, dataresource.id);
        return resource;
    };
    /**
     * @param {?} datacollection
     * @param {?} include
     * @param {?} collection
     * @return {?}
     */
    CacheStore.prototype.fillCollectionWithArrrayAndResourcesOnStore = function (datacollection, include, collection) {
        return __awaiter$1(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (resolve, reject) {
                    /** @type {?} */
                    var resources_by_id = {};
                    /** @type {?} */
                    var required_store_keys = datacollection.data.map(function (dataresource) {
                        /** @type {?} */
                        var cachememory = Converter.getService(dataresource.type).cachememory;
                        resources_by_id[dataresource.id] = cachememory.getOrCreateResource(dataresource.type, dataresource.id);
                        return resources_by_id[dataresource.id].type + '.' + dataresource.id;
                    });
                    // get resources for collection fill
                    Core.injectedServices.JsonapiStoreService.getDataResources(required_store_keys)
                        .then(function (store_data_resources) {
                        /** @type {?} */
                        var include_promises = [];
                        var _loop_2 = function (key) {
                            /** @type {?} */
                            var data_resource = store_data_resources[key];
                            resources_by_id[data_resource.id].fill({ data: data_resource });
                            // include some times is a collection :S
                            Base.forEach(include, function (resource_alias) {
                                _this.fillRelationshipFromStore(resources_by_id[data_resource.id], resource_alias, include_promises);
                            });
                            resources_by_id[data_resource.id].lastupdate = data_resource._lastupdate_time;
                        };
                        for (var key in store_data_resources) {
                            _loop_2(key);
                        }
                        // no debo esperar a que se resuelvan los include
                        if (include_promises.length === 0) {
                            if (datacollection.page) {
                                collection.page.number = datacollection.page.number;
                            }
                            for (var _i = 0, _a = datacollection.data; _i < _a.length; _i++) {
                                var dataresource = _a[_i];
                                /** @type {?} */
                                var resource = resources_by_id[dataresource.id];
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
                                .then(function (success3) {
                                if (datacollection.page) {
                                    collection.page.number = datacollection.page.number;
                                }
                                for (var _i = 0, _a = datacollection.data; _i < _a.length; _i++) {
                                    var dataresource = _a[_i];
                                    /** @type {?} */
                                    var resource = resources_by_id[dataresource.id];
                                    collection.data.push(resource);
                                }
                                resolve(null);
                            })
                                .catch(function (error3) {
                                reject(error3);
                            });
                        }
                    })
                        .catch(function (err) {
                        reject(err);
                    });
                });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * @param {?} resource
     * @param {?} resource_alias
     * @param {?} include_promises
     * @return {?}
     */
    CacheStore.prototype.fillRelationshipFromStore = function (resource, resource_alias, include_promises) {
        if (resource_alias.includes('.')) {
            /** @type {?} */
            var included_resource_alias_parts = resource_alias.split('.');
            /** @type {?} */
            var datadocument = resource.relationships[included_resource_alias_parts[0]].data;
            if (datadocument instanceof DocumentResource) {
                return this.fillRelationshipFromStore(datadocument.data, included_resource_alias_parts[1], include_promises);
            }
            else if (datadocument instanceof DocumentCollection) {
                for (var _i = 0, _a = datadocument.data; _i < _a.length; _i++) {
                    var related_resource = _a[_i];
                    this.fillRelationshipFromStore(related_resource, included_resource_alias_parts[1], include_promises);
                }
                return;
            }
        }
        if (resource.relationships[resource_alias] instanceof DocumentResource) {
            /** @type {?} */
            var related_resource = /** @type {?} */ (resource.relationships[resource_alias].data);
            if (!('attributes' in related_resource)) {
                /** @type {?} */
                var builded_resource = this.getResourceFromMemory(related_resource);
                if (builded_resource.is_new) {
                    // no está en memoria, la pedimos a store
                    include_promises.push(this.getResource(builded_resource));
                }
                else if (core.isDevMode()) {
                    console.warn('ts-angular-json: esto no debería pasar #isdjf2l1a');
                }
                resource.addRelationship(builded_resource, resource_alias);
            }
        }
        // else @todo hasMany??
    };
    return CacheStore;
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
    if (ttl === void 0) { ttl = null; }
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
        if (Array.isArray(params) || util.isObject(params)) {
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
                this.addParam(Core.injectedServices.rsJsonapiConfig.parameters.page.number + '=' + params.page.number);
            }
            if (params.page.size) {
                this.addParam(Core.injectedServices.rsJsonapiConfig.parameters.page.size + '=' + params.page.size);
            }
        }
        if (params.sort && params.sort.length) {
            this.addParam('sort=' + params.sort.join(','));
        }
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
// unsupported: template constraints.
/**
 * @template R
 */
var Service = /** @class */ (function () {
    function Service() {
        this.resource = Resource;
    }
    /**
     * @return {?}
     */
    Service.prototype.register = function () {
        if (Core.me === null) {
            throw new Error('Error: you are trying register `' + this.type + '` before inject JsonapiCore somewhere, almost one time.');
        }
        // only when service is registered, not cloned object
        this.cachememory = new CacheMemory();
        this.cachestore = new CacheStore();
        return Core.me.registerService(this);
    };
    /**
     * @return {?}
     */
    Service.prototype.newResource = function () {
        /** @type {?} */
        var resource = new this.resource();
        return /** @type {?} */ (resource);
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
        var resource = this.newResource();
        resource.type = this.type;
        // issue #36: just if service is not registered yet.
        this.getService();
        resource.reset();
        return resource;
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
    Service.prototype.pathForGet = function (id, params) {
        if (params === void 0) { params = {}; }
        params = Object.assign({}, Base.ParamsResource, params);
        /** @type {?} */
        var path = new PathBuilder();
        path.applyParams(this, params);
        path.appendPath(id);
        path.setApiBaseUrl(this.apiBaseUrl);
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
        path.setApiBaseUrl(this.apiBaseUrl);
        /** @type {?} */
        var resource = this.getOrCreateResource(id);
        resource.is_loading = true;
        /** @type {?} */
        var subject = new rxjs.BehaviorSubject(resource);
        if (isLive(resource, params.ttl)) {
            subject.complete();
            resource.is_loading = false;
        }
        else if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
            // CACHESTORE
            this.getService()
                .cachestore.getResource(resource, params.include)
                .then(function () {
                if (!isLive(resource, params.ttl)) {
                    subject.next(resource);
                    throw new Error('No está viva la caché de localstorage');
                }
                resource.is_loading = false;
                subject.next(resource);
                subject.complete();
            })
                .catch(function () {
                _this.getGetFromServer(path, resource, subject);
            });
        }
        else {
            this.getGetFromServer(path, resource, subject);
        }
        subject.next(resource);
        return subject.asObservable();
    };
    /**
     * @param {?} path
     * @param {?} resource
     * @param {?} subject
     * @return {?}
     */
    Service.prototype.getGetFromServer = function (path, resource, subject) {
        var _this = this;
        Core.get(path.get()).subscribe(function (success) {
            resource.fill(/** @type {?} */ (success));
            resource.is_loading = false;
            _this.getService().cachememory.setResource(resource);
            if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
                _this.getService().cachestore.setResource(resource);
            }
            subject.next(resource);
            subject.complete();
        }, function (error) {
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
        var collection = /** @type {?} */ (this.getService().cachememory.getOrCreateCollection(path.getForCache()));
        return collection;
    };
    /**
     * @param {?} id
     * @return {?}
     */
    Service.prototype.getOrCreateResource = function (id) {
        /** @type {?} */
        var service = this.getService();
        if (service.cachememory && id in service.cachememory.resources) {
            return /** @type {?} */ (service.cachememory.resources[id]);
        }
        else {
            /** @type {?} */
            var resource = service.new();
            resource.id = id;
            service.cachememory.setResource(resource, false);
            return /** @type {?} */ (resource);
        }
    };
    /**
     * @return {?}
     */
    Service.prototype.clearCacheMemory = function () {
        /** @type {?} */
        var path = new PathBuilder();
        path.applyParams(this);
        path.setApiBaseUrl(this.apiBaseUrl);
        return (this.getService().cachememory.deprecateCollections(path.getForCache()) &&
            this.getService().cachestore.deprecateCollections(path.getForCache()));
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
        path.setApiBaseUrl(this.apiBaseUrl);
        /** @type {?} */
        var subject = new rxjs.Subject();
        Core.delete(path.get()).subscribe(function (success) {
            _this.getService().cachememory.removeResource(id);
            subject.next();
            subject.complete();
        }, function (error) {
            subject.error(error);
        });
        return subject.asObservable();
    };
    /**
     * @param {?=} params
     * @param {?=} apiBaseUrl
     * @return {?}
     */
    Service.prototype.pathForAll = function (params, apiBaseUrl) {
        if (params === void 0) { params = {}; }
        if (apiBaseUrl === void 0) { apiBaseUrl = ''; }
        params = Object.assign({}, Base.ParamsCollection, params);
        /** @type {?} */
        var path = new PathCollectionBuilder();
        path.applyParams(this, params);
        path.setApiBaseUrl(this.apiBaseUrl);
        return path.get();
    };
    /**
     * @param {?=} params
     * @return {?}
     */
    Service.prototype.all = function (params) {
        var _this = this;
        if (params === void 0) { params = {}; }
        params = Object.assign({}, Base.ParamsCollection, params);
        /** @type {?} */
        var path = new PathCollectionBuilder();
        path.applyParams(this, params);
        path.setApiBaseUrl(this.apiBaseUrl);
        /** @type {?} */
        var temporary_collection = this.getOrCreateCollection(path);
        temporary_collection.page.number = params.page.number * 1;
        /** @type {?} */
        var subject = new rxjs.BehaviorSubject(temporary_collection);
        if (isLive(temporary_collection, params.ttl)) {
            temporary_collection.source = 'memory';
            subject.next(temporary_collection);
            setTimeout(function () { return subject.complete(); }, 0);
        }
        else if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
            // STORE
            temporary_collection.is_loading = true;
            this.getService()
                .cachestore.fillCollectionFromStore(path.getForCache(), path.includes, temporary_collection)
                .subscribe(function () {
                temporary_collection.source = 'store';
                // when load collection from store, we save collection on memory
                _this.getService().cachememory.setCollection(path.getForCache(), temporary_collection);
                if (isLive(temporary_collection, params.ttl)) {
                    temporary_collection.is_loading = false;
                    subject.next(temporary_collection);
                    subject.complete();
                }
                else {
                    _this.getAllFromServer(path, params, temporary_collection, subject);
                }
            }, function (err) {
                _this.getAllFromServer(path, params, temporary_collection, subject);
            });
        }
        else {
            this.getAllFromServer(path, params, temporary_collection, subject);
        }
        return subject.asObservable();
    };
    /**
     * @param {?} path
     * @param {?} params
     * @param {?} temporary_collection
     * @param {?} subject
     * @return {?}
     */
    Service.prototype.getAllFromServer = function (path, params, temporary_collection, subject) {
        var _this = this;
        temporary_collection.is_loading = true;
        subject.next(temporary_collection);
        Core.get(path.get()).subscribe(function (success) {
            temporary_collection.source = 'server';
            temporary_collection.is_loading = false;
            // this create a new ID for every resource (for caching proposes)
            // for example, two URL return same objects but with different attributes
            if (params.cachehash) {
                for (var key in success.data) {
                    /** @type {?} */
                    var resource = success.data[key];
                    resource.id = resource.id + params.cachehash;
                }
            }
            temporary_collection.fill(/** @type {?} */ (success));
            temporary_collection.cache_last_update = Date.now();
            _this.getService().cachememory.setCollection(path.getForCache(), temporary_collection);
            if (Core.injectedServices.rsJsonapiConfig.cachestore_support) {
                _this.getService().cachestore.setCollection(path.getForCache(), temporary_collection, params.include);
            }
            subject.next(temporary_collection);
            subject.complete();
        }, function (error) {
            // do not replace source, because localstorage don't write if = server
            // temporary_collection.source = 'server';
            temporary_collection.is_loading = false;
            subject.next(temporary_collection);
            subject.error(error);
        });
    };
    return Service;
}());

exports.Autoregister = Autoregister;
exports.JsonapiCore = Core;
exports.Resource = Resource;
exports.DocumentResource = DocumentResource;
exports.DocumentCollection = DocumentCollection;
exports.Service = Service;
exports.NgxJsonapiModule = NgxJsonapiModule;
exports.ɵd = Document;
exports.ɵa = JsonapiConfig;
exports.ɵc = Http;
exports.ɵb = StoreService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-jsonapi.umd.js.map
