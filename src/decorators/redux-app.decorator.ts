declare var Reflect: any;

import { provide, ChangeDetectionStrategy, Type,
    ViewEncapsulation, ComponentMetadata } from '@angular/core';
import { createStoreWithEnhancersArray } from './../store';
import { createProvider } from './../provider';

const getDebugEnhancer = () => window['devToolsExtension'] ? window['devToolsExtension']() : f => f;
const getEnhancersByDebugMode = (debug, enhancers = []) => {
    return debug ? [...enhancers, getDebugEnhancer()] : enhancers;
};

export function ReduxApp(config: {
    selector?: string,
    inputs?: string[],
    outputs?: string[],
    properties?: string[],
    events?: string[],
    host?: { [key: string]: string },
    providers?: any[],
    exportAs?: string,
    moduleId?: string,
    viewProviders?: any[],
    queries?: { [key: string]: any },
    changeDetection?: ChangeDetectionStrategy,
    templateUrl?: string,
    template?: string,
    styleUrls?: string[],
    styles?: string[],
    directives?: Array<Type | any[]>,
    pipes?: Array<Type | any[]>,
    encapsulation?: ViewEncapsulation,
    reducer: (state: any, action: any) => any,
    initialState?: any,
    enhancers?: Array<Function>,
    debug?: boolean
} = { reducer: null }) {

    return function (cls) {

        let store = createStoreWithEnhancersArray(
            config.reducer,
            config.initialState,
            getEnhancersByDebugMode(config.debug, config.enhancers)
        );

        let storeProvider = createProvider(store);
        let providers = config.providers || [];
        // add redux store provider to providers that were passed initially
        config.providers = [storeProvider, ...providers];

        // create @ComponentMetadata
        let reduxComponentMetadata = new ComponentMetadata(config);
        // get current annotations
        let annotations = Reflect.getMetadata('annotations', cls) || [];
        annotations = [...annotations, ...[reduxComponentMetadata]];
        // redefine with added annotations
        Reflect.defineMetadata('annotations', annotations, cls);
        return cls;
    };
}
