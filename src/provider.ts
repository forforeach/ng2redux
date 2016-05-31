 import { provide, Provider, NgZone } from '@angular/core';

import { Store } from './store';

export const createProvider = (store: any): Provider => {
    return provide(Store, {
        useFactory: (zone) => {
            return new Store(store, zone);
        },
        deps: [NgZone]
    });
};

