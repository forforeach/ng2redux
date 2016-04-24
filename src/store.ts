import {NgZone} from 'angular2/core';
import {Reducer, createStore, compose, Store as ReduxStore} from 'redux';

import {isFunction} from './utils/utils';

export const createStoreWithEnhancersArray = (reducer: Function, initialState?: any,
    storeEnhancers?: Function[]): ReduxStore => {

    let enhancer = storeEnhancers ? compose(...storeEnhancers) : null;
    return createStore(reducer as Reducer, initialState, enhancer);
};

export interface GetReducer {
    (): Reducer;
}
export interface ReplaceReducer {
    (nextReducer: Reducer): void;
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


export class Store {
    getReducer: GetReducer;
    replaceReducer: ReplaceReducer;
    dispatch: Dispatch;
    getState: GetState;
    subscribe: Subscribe;
    constructor(private store: ReduxStore, private zone: NgZone) {
        this.getReducer = store.getReducer;
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