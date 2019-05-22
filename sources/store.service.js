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
import * as localForage from 'localforage';
import { extendPrototype as extendGetitems } from 'localforage-getitems';
import { Base } from '../services/base';
import { noop, Subject } from 'rxjs';
extendGetitems(localForage);
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
export class StoreService {
    constructor() {
        if (false) {
            this.globalstore = localForage.createInstance({
                name: 'jsonapiglobal'
            });
            this.allstore = localForage.createInstance({ name: 'allstore' });
        }
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
if (false) {
    /** @type {?} */
    StoreService.prototype.globalstore;
    /** @type {?} */
    StoreService.prototype.allstore;
}
//# sourceMappingURL=store.service.js.map