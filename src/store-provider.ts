import {provide, Provider} from 'angular2/core';
import {createStore, compose, Reducer} from 'redux';

import {Store} from './store';
import {isFunction} from './utils/utils';

export namespace StoreProvider {
    let provider = null;

    export const get = (reducer: Function, initialState?: any,
        storeEnhancers?: Function[]): Provider => {

        return provider ?
            provider : provider = createProvider(reducer, initialState, storeEnhancers);
    };

    const createProvider = (reducer: Function, initialState?: any,
        storeEnhancers?: Function[]): Provider => {

        let enhancer = storeEnhancers ? compose(...storeEnhancers) : null;
        let store = createStore(reducer as Reducer, initialState, enhancer);
        return provide(Store, { useValue: store });
    };
}
