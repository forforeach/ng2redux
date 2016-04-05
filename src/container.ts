import {Injectable, OnDestroy} from 'angular2/core';

import {Store} from './store';

@Injectable()
export class Container implements OnDestroy {
    unsubscribe: Function = () => { };

    ngOnDestroy() {
        this.unsubscribe();
    }
}