import { Observable } from 'rxjs';
import { IDataResource } from '../interfaces/data-resource';
import { IDataCollection } from '../interfaces/data-collection';
import { IObjectsById } from '../interfaces';
interface IDataResourceStorage extends IDataResource {
    _lastupdate_time: number;
}
export declare class StoreService {
    private globalstore;
    private allstore;
    constructor();
    getDataObject(type: 'collection', url: string): Observable<IDataCollection>;
    getDataObject(type: string, id: string): Observable<IDataResource>;
    getDataResources(keys: Array<string>): Promise<IObjectsById<IDataResourceStorage>>;
    saveResource(type: string, url_or_id: string, value: IDataResource): void;
    saveCollection(url_or_id: string, value: IDataCollection): void;
    clearCache(): void;
    deprecateObjectsWithKey(key_start_with: string): void;
    private checkIfIsTimeToClean;
    private checkAndDeleteOldElements;
}
export {};
