import {NgZone} from 'angular2/core';
import {Reducer, createStore, compose, Store as ReduxStore} from 'redux';

import {isFunction} from './utils/utils';

export class Store {

    constructor(private store: ReduxStore, private zone: NgZone) {
    }

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
        return this.store.subscribe(() => {
            let state = this.getState();
            this.zone.run(() => listener(state));
        });
    };
}