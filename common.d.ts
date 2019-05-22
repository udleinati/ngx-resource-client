import { ICacheable } from './interfaces/cacheable';
import { DocumentResource } from './document-resource';
import { DocumentCollection } from './document-collection';
export declare function isLive(cacheable: ICacheable, ttl?: number): boolean;
export declare function isCollection(document: DocumentResource | DocumentCollection): document is DocumentCollection;
export declare function isResource(document: DocumentResource | DocumentCollection): document is DocumentResource;
