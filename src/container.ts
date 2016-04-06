import {Injectable, OnDestroy} from 'angular2/core';

import {Store} from './store';

export class Container implements OnDestroy {
    unsubscribe: Function = () => { };

    ngOnDestroy() {
        this.unsubscribe();
    }
}