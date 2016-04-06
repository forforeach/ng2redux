# ng2redux
An Angular2 wrapper for [Redux](http://redux.js.org/)


* [Installation](#installation)
* [Usage](#usage)
* [API](#api)


## Installation
Install the module via npm:
```sh
npm install ng2redux --save
```
This module depends on angular2 and redux. You can install them via npm as well:
```sh
npm install angular2 redux --save
```

## Usage

The most simple use case is to import `ReduxApp` decorator and `Store` from ng2redux.
`ReduxApp` is a decorator that extends angular's [Component](https://angular.io/docs/ts/latest/api/core/Component-decorator.html) decorator. It accepts all  `Component`'s properties and 3 additional properties related to Redux - reducer, initialState and enhancers. Behind the scenes it creates single [Redux store](http://redux.js.org/docs/basics/Store.html) and injects its provider to component's providers. Thus, it is recomended to use this decorator only once per application on top-level app component.

Now you can inject `Store` into your components, as usual service. `Store` wraps up the [Redux store](http://redux.js.org/docs/basics/Store.html) and reveals regular [Redux store's API](http://redux.js.org/docs/api/Store.html).
```ts
import {ReduxApp, Store, Container} from 'ng2redux';
import {reducer} from './reducers'; // your own reducer implementation

@ReduxApp({
    selector: 'app',
    template: `
        <h1>Hello!</h1>
    `,
    reducer: reducer
})
export class AppComponent extends Container {
    unsubscribe: Function;
    constructor(private store: Store) {
        this.unsubscribe = store.subscribe((state: any) => {
            // your logic here
        });
    }

    public ngOnDestroy() {
        this.unsubscribe();
    }
}

bootstrap(AppComponent);
```


## API
### ReduxApp
#### Properties:
