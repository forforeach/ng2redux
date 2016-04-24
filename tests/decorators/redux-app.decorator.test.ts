declare var Reflect: any;

import {ReduxApp} from './../../src/decorators/redux-app.decorator';
import {isFunction} from './../../src/utils/utils';

import {ComponentMetadata} from 'angular2/core';
import {it, describe, expect} from 'angular2/testing';

describe('ReduxApp', () => {
    function TestConstructor() { }

    it('should return function on firts call', () => {
        expect(isFunction(ReduxApp())).toBe(true);
    });

    it('should add ComponentMetadata on annotations\' metadata', () => {
        Reflect.defineMetadata('annotations', [], TestConstructor);

        let NewConstructor = ReduxApp({ reducer: () => { } })(TestConstructor);
        let updatedMetadata = Reflect.getMetadata('annotations', NewConstructor);
        expect(Array.isArray(updatedMetadata)).toBe(true);
        expect(updatedMetadata.length).toBeGreaterThan(0);
        expect(updatedMetadata[updatedMetadata.length - 1])
            .toBeAnInstanceOf(ComponentMetadata);
    });

    it('should add store provider', () => {
        let NewConstructor = ReduxApp({ reducer: () => { } })(TestConstructor);
        let updatedMetadata = Reflect.getMetadata('annotations', NewConstructor);
        let componentMetadata = updatedMetadata[updatedMetadata.length - 1];

        expect(componentMetadata.providers.length).toBe(1);
    });
});