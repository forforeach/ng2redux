import {isFunction} from './../src/utils/utils';

export const getStoreMock = () => {
    let subscribed = null;
    let state = 0;
    return {
        hasSubscribed: () => !!subscribed,
        getSubscribed: () => subscribed,
        dispatch: () => {
            state++;
            return isFunction(subscribed) && subscribed();
        },
        getState: () => state,
        subscribe: (func: any) => {
            subscribed = func;
            return () => {
                subscribed = null;
            };
        }
    }
};