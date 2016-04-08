import {NgZone} from 'angular2/core';
import {Reducer, createStore, compose, Store as ReduxStore} from 'redux';

import {isFunction} from './utils/utils';


let store: ReduxStore;
const createStoreWithEnhancersArray = (reducer: Function, initialState?: any,
    storeEnhancers?: Function[]): ReduxStore => {

    let enhancer = storeEnhancers ? compose(...storeEnhancers) : null;
    return createStore(reducer as Reducer, initialState, enhancer);
};

export const getAppStore = (reducer?: Function, initialState?: any,
    storeEnhancers?: Function[]): ReduxStore => {

    if (!store) {
        store = createStoreWithEnhancersArray(reducer, initialState, storeEnhancers);
    }
    return store;
};

export class Store {

    constructor(private store: ReduxStore, private zone: NgZone) {
        this.getReducer = store.getReducer;
        this.replaceReducer = store.replaceReducer;
        this.dispatch = store.dispatch;
        this.getState = store.getState;
        this.subscribe = function(listener: Function) {
            if (!isFunction(listener)) {
                throw new Error('Expected listener to be a function');
            }
            return store.subscribe(() => {
                let state = store.getState();
                // wraps up the listener to run it in current app zone.
                // it provides an ability to run up with two or more root components
                // that share one store.
                // also injects the new state into the listener
                zone.run(() => listener(state));
            });
        };
    }

    getReducer(): Reducer | any { };

    replaceReducer(nextReducer: Reducer): void { };

    dispatch(action: any): any { }

    getState(): any { }

    subscribe(listener: Function): Function | any { }
}