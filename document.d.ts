import { IDocumentData } from './interfaces/document';
import { Resource } from './resource';
export declare class Document implements IDocumentData {
    data: Array<Resource> | Resource;
    builded: boolean;
    content: 'ids' | 'collection' | 'id' | 'resource';
    is_loading: boolean;
    source: 'new' | 'memory' | 'store' | 'server';
    cache_last_update: number;
    meta: {
        [key: string]: any;
    };
}
