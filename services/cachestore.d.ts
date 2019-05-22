import { Resource } from '../resource';
import { DocumentCollection } from '../document-collection';
import { Observable } from 'rxjs';
export declare class CacheStore {
    getResource(resource: Resource, include?: Array<string>): Promise<object>;
    setResource(resource: Resource): void;
    setCollection(url: string, collection: DocumentCollection, include: Array<string>): void;
    deprecateCollections(path_start_with: string): boolean;
    fillCollectionFromStore(url: string, include: Array<string>, collection: DocumentCollection): Observable<DocumentCollection>;
    private fillCollectionWithArrrayAndResourcesOnMemory;
    private getResourceFromMemory;
    private fillCollectionWithArrrayAndResourcesOnStore;
    private fillRelationshipFromStore;
}
