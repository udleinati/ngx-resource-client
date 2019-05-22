import { Resource } from '../resource';
import { DocumentCollection } from '../document-collection';
import { IObjectsById } from '../interfaces';
export declare class CacheMemory<R extends Resource = Resource> {
    resources: IObjectsById<Resource>;
    private collections;
    private collections_lastupdate;
    isCollectionExist(url: string): boolean;
    isCollectionLive(url: string, ttl: number): boolean;
    isResourceLive(id: string, ttl: number): boolean;
    getOrCreateCollection(url: string): DocumentCollection<R>;
    setCollection(url: string, collection: DocumentCollection<R>): void;
    getOrCreateResource(type: string, id: string): Resource;
    setResource(resource: Resource, update_lastupdate?: boolean): void;
    deprecateCollections(path_start_with: string): boolean;
    removeResource(id: string): void;
    private addResourceOrFill;
}
