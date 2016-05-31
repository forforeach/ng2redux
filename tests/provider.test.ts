import { createProvider } from './../src/provider';
import { Store } from './../src/store';
import { provide, Provider, NgZone } from '@angular/core';
import { it, describe, expect } from '@angular/core/testing';

describe('Provider', () => {
    describe('createProvider', () => {

        it('should be declared', () => {
            expect(createProvider).toBeTruthy();
        });

        it('should be a function', () => {
            expect(typeof createProvider).toBe('function');
        });

        it('should return provider', () => {
            let provider = createProvider({});
            expect(provider instanceof Provider).toBeTruthy();
        });

        it('should return provider with factory usage', () => {
            let provider = createProvider({});
            expect(typeof provider.useFactory).toBe('function');
        });

        it('should create Store with factory function', () => {
            let provider = createProvider({});
            let store = provider.useFactory({});
            expect(store instanceof Store).toBeTruthy();
        });
    });
});