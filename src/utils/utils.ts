export const isFunction = val => typeof val === 'function';
export const isDefined = val => typeof val !== 'undefined';
export const isUndefined = val => !isDefined(val);
export const isBlank = val => val === undefined || val === null;
export const isObject = val => typeof val === 'object';