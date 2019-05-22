import { IParams } from './params';
import { IPage } from './page';
export interface IParamsCollection extends IParams {
    remotefilter?: object;
    smartfilter?: object;
    sort?: Array<string>;
    page?: IPage;
    storage_ttl?: number;
    cachehash?: string;
}
