import { IDataResource } from './data-resource';
import { IDocumentData } from '../interfaces/document';
import { IPage } from './page';
export interface IDataCollection extends IDocumentData {
    data: Array<IDataResource>;
    page?: IPage;
    _lastupdate_time?: number;
}
