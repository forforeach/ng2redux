import {Reducer, createStore, compose, Store as ReduxStore} from 'redux';

import {isFunction} from './utils/utils';

export class Store {

    constructor(private store: ReduxStore) { }

    getReducer(): Reducer {
        return this.store.getReducer();
    }

    replaceReducer(nextReducer: Reducer): void {
        this.store.replaceReducer(nextReducer);
    }
    dispatch(action: any): any {
        return this.store.dispatch(action);
    };
    getState(): any {
        return this.store.getState();
    };
    subscribe(listener: Function): Function {
        if (!isFunction(listener)) {
            throw new Error('Expected listener to be a function');
        }
        return this.store.subscribe(() => listener(this.getState()));
    };
}