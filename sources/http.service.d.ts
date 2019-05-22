import { IDataObject } from '../interfaces/data-object';
import { HttpClient } from '@angular/common/http';
import { JsonapiConfig } from '../jsonapi-config';
import { Observable } from 'rxjs';
import { IDocumentData } from '../interfaces/document';
export declare class Http {
    private http;
    private rsJsonapiConfig;
    constructor(http: HttpClient, rsJsonapiConfig: JsonapiConfig);
    exec(path: string, method: string, data?: IDataObject): Observable<IDocumentData>;
}
