import { PathBuilder } from './path-builder';
import { IParamsCollection } from '../interfaces';
import { Service } from '../service';
export declare class PathCollectionBuilder extends PathBuilder {
    applyParams(service: Service, params?: IParamsCollection): void;
    protected addParam(param: string): void;
}
