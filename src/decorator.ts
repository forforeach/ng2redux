/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
import {provide, ChangeDetectionStrategy, Type,
    ViewEncapsulation, ComponentMetadata} from 'angular2/core';

import {StoreProvider} from './store-provider';

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
    reducer: Function,
    initialState?: any,
    enhancers?: Array<Function>
} = { reducer: null, providers: [], enhancers: []}) {
    return function(cls) {
        // get current annotations
        let annotations = Reflect.getMetadata('annotations', cls) || [];
        let storeProvider = StoreProvider.get(config.reducer, config.initialState,
            [window['devToolsExtension'] ?
                window['devToolsExtension']() : f => f, ...config.enhancers]);
        // add redux store provider to providers that were passed initially
        config.providers = [storeProvider, ...(config.providers || [])];
        // create @ComponentMetadata
        let reduxMetadata = new ComponentMetadata(config);
        annotations.push(reduxMetadata);
        // redefine with added annotations
        Reflect.defineMetadata('annotations', annotations, cls);
        return cls;
    };
}
