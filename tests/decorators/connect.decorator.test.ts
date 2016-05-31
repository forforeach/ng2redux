declare var Reflect: any;

import { Connect } from './../../src/decorators/connect.decorator';
import { Store } from './../../src/store';
import { isFunction } from './../../src/utils/utils';
import { getStoreMock } from './../store.mock';

import { it, describe, expect } from '@angular/core/testing';

describe('Connect', () => {

    let storeMock;
    function TestConstructor() { };

    beforeEach(function () {
        storeMock = getStoreMock();
        delete TestConstructor.prototype.ngOnDestroy;
    });


    it('should throw when more then 19 params are passed', () => {
        expect(() => {
            Connect({})((d1, d2, d3, d4, d5, d6,
                d7, d8, d9, d10, d11, d12, d13, d14, d15,
                d16, d17, d18, d19, d20) => { });
        }).toThrowError();
    });

    it('shouldn\'t throw when less then or exactly 19 params are passed', () => {
        expect(() => {
            Connect({})((d1, d2, d3, d4, d5, d6,
                d7, d8, d9, d10, d11, d12, d13, d14, d15,
                d16, d17, d18, d19) => { });
        }).not.toThrowError();
    });

    it(`should return constructor that creates
        objects that are instances of initially defined
        type`, () => {
            let NewConstructor = Connect({})(TestConstructor);
            let instance = new NewConstructor(storeMock);

            expect(instance).toBeAnInstanceOf(TestConstructor);
            expect(instance.__extends).toBe(TestConstructor['name']);
        });

    it('should set props on instance', () => {
        let NewConstructor = Connect({
            mapStateToProps: (state) => {
                return {
                    x: 1,
                    y: 2
                };
            }
        })(TestConstructor);
        let instance = new NewConstructor(storeMock);
        expect(instance.x).toBe(1);
        expect(instance.y).toBe(2);
    });

    it('should map props to state', () => {
        let NewConstructor = Connect({
            mapStateToProps: (state) => {
                return {
                    x: state
                };
            }
        })(TestConstructor);
        let instance = new NewConstructor(storeMock);
        expect(instance.x).toBe(storeMock.getState());
        storeMock.dispatch();
        expect(instance.x).toBe(storeMock.getState());
    });

    it('should set map actions to instance', () => {
        let NewConstructor = Connect({
            mapStateToProps: null,
            mapDispatchToProps: (dispatch) => {
                return {
                    func1: () => { },
                    func2: () => { }
                };
            }
        })(TestConstructor);
        let instance = new NewConstructor(storeMock);
        expect(isFunction(instance.func1)).toBeTruthy();
        expect(isFunction(instance.func2)).toBeTruthy();
    });

    it('should be able to unsubscribe', () => {
        let NewConstructor = Connect({})(TestConstructor);
        let instance = new NewConstructor(storeMock);
        expect(isFunction(instance.__unsubscribe)).toBe(true);
        expect(storeMock.hasSubscribed()).toBe(true);
        expect(isFunction(storeMock.getSubscribed())).toBe(true);
        instance.__unsubscribe();
        expect(storeMock.hasSubscribed()).toBe(false);
        expect(storeMock.getSubscribed()).toBe(null);
    });

    it('should preserve NgOnDestroy', () => {
        let flag = false;
        TestConstructor.prototype.ngOnDestroy = () => flag = true;
        let NewConstructor = Connect({})(TestConstructor);
        let instance = new NewConstructor(storeMock);
        expect(isFunction(instance.ngOnDestroy)).toBe(true);
        instance.ngOnDestroy();
        expect(flag).toBe(true);
    });

    it('should unsubscribe when call to NgOnDestroy', () => {
        let NewConstructor = Connect({})(TestConstructor);
        let instance = new NewConstructor(storeMock);
        expect(storeMock.hasSubscribed()).toBe(true);
        expect(isFunction(instance.ngOnDestroy)).toBe(true);
        instance.ngOnDestroy();
        expect(storeMock.hasSubscribed()).toBe(false);
        expect(storeMock.getSubscribed()).toBe(null);
    });

    it('should set Store to metadata', () => {
        Reflect.defineMetadata('design:paramtypes', [], TestConstructor);

        let NewConstructor = Connect({})(TestConstructor);
        let instance = new NewConstructor(storeMock);

        let updatedMetadata = Reflect.getMetadata('design:paramtypes', NewConstructor);
        expect(Array.isArray(updatedMetadata)).toBe(true);
        expect(updatedMetadata.length).toBe(1);
        expect(updatedMetadata[0]).toBe(Store);
    });
});