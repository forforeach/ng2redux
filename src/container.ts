import {OnDestroy} from 'angular2/core';

export class Container implements OnDestroy {
    unsubscribe: Function = () => { };

    ngOnDestroy() {
        this.unsubscribe();
    }
}