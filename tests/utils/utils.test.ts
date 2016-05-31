import { isFunction } from './../../src/utils/utils';
import { it, describe, expect } from '@angular/core/testing';

describe('utils', () => {
    describe('isFunction', () => {
        it('should return true when function passed', () => {
            expect(isFunction(() => { })).toBe(true);
        });

        it('should return false when not function passed', () => {
            expect(isFunction(null)).toBe(false);
            expect(isFunction({})).toBe(false);
            expect(isFunction(1)).toBe(false);
        });
    });
});