import {provide, Provider} from 'angular2/core';
import {createStore, compose, Reducer} from 'redux';

import {Store} from './store';
import {isFunction} from './utils/utils';

export namespace StoreProvider {
    let provider = null;

    const createProvider = (reducer: Function, initialState?: any,
        storeEnhancers?: Function[]): Provider => {

        let enhancer = storeEnhancers ? compose(...storeEnhancers) : null;
        let reduxStore = createStore(reducer as Reducer, initialState, enhancer);
        let store = new Store(reduxStore);

        return provide(Store, { useValue: store });
    };

    export const get = (reducer: Function, initialState?: any,
        storeEnhancers?: Function[]): Provider => {

        return provider ?
            provider : provider = createProvider(reducer, initialState, storeEnhancers);
    };
}
