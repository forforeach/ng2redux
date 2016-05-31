import { it, describe, expect } from '@angular/core/testing';
import { Store } from './../src/store';
import { isFunction } from './../src/utils/utils';
import { getStoreMock } from './store.mock';

describe('Store', () => {
    let zoneMock;
    let storeMock;
    let zoneVisited = false;

    beforeEach(function () {
        storeMock = getStoreMock();
        zoneMock = {
            run: (f: Function) => {
                zoneVisited = true;
                f();
            }
        };
        zoneVisited = false;
    });

    it('should run subscribed function through Zone.run', () => {
        let store = new Store(storeMock, zoneMock);
        store.subscribe(() => {});
        store.dispatch({});
        expect(zoneVisited).toBe(true);
    });

    it('should throw when subscribe without function callback', () => {
        let store = new Store(storeMock, zoneMock);
        expect(() => store.subscribe(undefined)).toThrowError();
    });
});