import { Resource } from './resource';
import { Page } from './services/page';
import { Document } from './document';
import { ICacheable } from './interfaces/cacheable';
import { IResourcesByType } from './interfaces/resources-by-type';
import { IDataCollection } from './interfaces/data-collection';
export declare class DocumentCollection<R extends Resource = Resource> extends Document implements ICacheable {
    data: Array<R>;
    page: Page;
    data_collection: IDataCollection;
    trackBy(iterated_resource: Resource): string;
    find(id: string): R;
    fill(data_collection: IDataCollection, included_resources?: IResourcesByType): void;
    replaceOrAdd(resource: R): void;
    hasMorePages(): boolean | null;
}
