import { Service } from './service';
import { IDataObject } from './interfaces/data-object';
import { IResourcesByType } from './interfaces/resources-by-type';
import { IAttributes, IParamsResource, ILinks } from './interfaces';
import { ICacheable } from './interfaces/cacheable';
import { Observable } from 'rxjs';
import { IRelationships } from './interfaces/relationship';
export declare class Resource implements ICacheable {
    id: string;
    type: string;
    attributes: IAttributes;
    relationships: IRelationships;
    relationships_definitions: IRelationships;
    links: ILinks;
    is_new: boolean;
    is_saving: boolean;
    is_loading: boolean;
    source: 'new' | 'store';
    cache_last_update: number;
    lastupdate: number;
    data_resource: IDataObject;
    reset(): void;
    toObject(params?: IParamsResource): IDataObject;
    fill(data_object: IDataObject, included_resources?: IResourcesByType): void;
    addRelationship<T extends Resource>(resource: T, type_alias?: string): void;
    addRelationships<R extends Resource>(resources: Array<R>, type_alias: string): void;
    /**
     * @deprecated
     */
    addRelationshipsArray<R extends Resource>(resources: Array<R>, type_alias: string): void;
    removeRelationship(type_alias: string, id: string): boolean;
    hasManyRelated(resource: string): boolean;
    hasOneRelated(resource: string): boolean;
    getService(): Service;
    save<T extends Resource>(params?: IParamsResource): Observable<object>;
}
