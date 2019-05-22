import { Resource } from './resource';
import { Page } from './services/page';
import { Document } from './document';
import { IDataObject } from './interfaces/data-object';
export declare class DocumentResource<R extends Resource = Resource> extends Document {
    data: R;
    builded: boolean;
    content: 'id' | 'resource';
    data_resource: IDataObject;
    page: Page;
    fill(data_resource: IDataObject): void;
}
