import {Reducer, createStore, compose} from 'redux';

import {isFunction} from './utils/utils';

export abstract class Store {
    abstract getReducer(): Reducer;
    abstract replaceReducer(nextReducer: Reducer): void;
    abstract dispatch(action: any): any;
    abstract getState(): any;
    abstract subscribe(listener: Function): Function;
}