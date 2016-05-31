import { OnDestroy } from '@angular/core';

export class Container implements OnDestroy {
    unsubscribe: Function = () => { };

    ngOnDestroy() {
        this.unsubscribe();
    }
}