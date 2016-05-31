import { NgZone } from '@angular/core';
import { Reducer, createStore, compose, Store as ReduxStore } from 'redux';

import { isFunction } from './utils/utils';

export function createStoreWithEnhancersArray<T>(reducer: Function, initialState?: any,
    storeEnhancers?: Function[]): ReduxStore<T> {

    let enhancer = storeEnhancers ? compose.apply(null, storeEnhancers) : null;
    return createStore(reducer as Reducer<T>, initialState, enhancer);
}

export interface GetReducer<T> {
    (): Reducer<T>;
}
export interface ReplaceReducer<T> {
    (nextReducer: Reducer<T>): void;
}
export interface Dispatch {
    (action: any): any;
}
export interface GetState {
    (): any;
}
export interface Subscribe {
    (listener: Function): Function;
}


export class Store<T> {
    getReducer: GetReducer<T>;
    replaceReducer: ReplaceReducer<T>;
    dispatch: Dispatch;
    getState: GetState;
    subscribe: Subscribe;
    constructor(private store: ReduxStore<T>, private zone: NgZone) {
        this.replaceReducer = store.replaceReducer;
        this.dispatch = store.dispatch;
        this.getState = store.getState;
        this.subscribe = function (listener: Function) {
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
}