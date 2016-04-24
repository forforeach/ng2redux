# ng2redux
**An Angular2 bindings for [Redux](http://redux.js.org/)**

[![Build Status](https://travis-ci.org/forforeach/ng2redux.svg?branch=master)](https://travis-ci.org/forforeach/ng2redux) [![npm version](https://img.shields.io/npm/v/ng2redux.svg)](https://www.npmjs.com/package/ng2redux)
[![npm](https://img.shields.io/npm/dm/ng2redux.svg)](https://www.npmjs.com/package/ng2redux)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


* [Installation](#installation)
* [Usage](#usage)
* [API](#api)


## Installation

Install the module via npm:
```sh
npm install --save ng2redux
```
This module depends on Angular2 and Redux. You can install them via npm as well:
```sh
npm install --save angular2 redux
```

## Usage

The most simple use case is to import `ReduxApp` decorator and `Store` from ng2redux.
Use `ReduxApp` decorator instead of app `Component` decorator. Add additional argument - reducer. It is the app reducer for Redux. It will be created and visible to an app component and its children.

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
export class AppComponent {
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
### `@ReduxApp`

`@ReduxApp` is a [decorator](https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md) that extends angular's [@Component](https://angular.io/docs/ts/latest/api/core/Component-decorator.html) decorator. It accepts all  `@Component`'s properties and 3 additional properties that are define a Redux store  - reducer, initialState and enhancers.

Behind the scenes it creates single [Redux store](http://redux.js.org/docs/basics/Store.html) and injects its provider to component's providers. Thus, it is recomended to use this decorator only once per application on top-level app component.

>**Note:** `@ReduxApp` extends `@Component`, therefore there is no need to use additional `@Component` decorator on the same component.

#### Properties:

1. `reducer` *(Function)*: A Redux reducer function that returns the next state tree, given the current state tree and an action to handle (more about reducers is [here](http://redux.js.org/docs/basics/Reducers.html)).

2. [`initialState`] *(Object)*: The initial state. It is an optional argument that describes initial state of our appliction. Should be plain object that can be understood by `reducer` (state explanation is [here](http://redux.js.org/docs/Glossary.html#state)).

3. [`enhancer`] *(Function)*: The store enhancer. You may optionally specify it to enhance the store with third-party capabilities such as middleware, time travel, persistence, etc. The only store enhancer that ships with Redux is [`applyMiddleware()`](http://redux.js.org/docs/api/applyMiddleware.html).


### `Store`

A `Store` is a wrapper for Redux [store](http://redux.js.org/docs/basics/Store.html) object. It may be injected into a component/service by declaring in constructor definition.

```ts
export class SomeClass{
    constructor(store: Store) {
        // c'tor logic here
    }
}
```
There should be a single instance of a store per application as it stated [here](http://redux.js.org/docs/introduction/ThreePrinciples.html) (single source of truth).
A `Store` reveals the same API as Redux store.

#### Methods

- [`getState()`](http://redux.js.org/docs/api/Store.html#getState)
- [`dispatch(action)`](http://redux.js.org/docs/api/Store.html#dispatch)
- [`subscribe(listener)`](http://redux.js.org/docs/api/Store.html#subscribe)
- [`replaceReducer(nextReducer)`](http://redux.js.org/docs/api/Store.html#replaceReducer)

>**Note:** `subscribe(listener)` is slightly different from the original function. Firstly, it runs a `listener` function within app [zone](https://angular.io/docs/ts/latest/api/core/NgZone-class.html). The second difference is that it injects a new state into listener as an only parameter.


### `@Connect`

`@Connect` is a [decorator](https://github.com/Microsoft/TypeScript-Handbook/blob/master/pages/Decorators.md) that connects an Angular component to a Redux store. It replaces a component's constructor before creation, so that the enriched component will be created by Angular. It preserves all the functions and properties of a component that where decleared, as well as all component's metadata.

#### Properties:

1. [`mapStateToProps(state): stateProps`] (*Function*): The function that describes how to map component's properties to state's properties. On every store update this function will be called with state as a parameter. It should return plain object with a newly mapped properties.

2. [`mapDispatchToProps(dispatch): dispatchProps`] *(Function)*: The function that describes how to dispatch a component's events to the store. It should return plain object with the dispatch mappings. Each property of returned object describes one mapping, where key is a name of an event on the component and value is a function that will dispatch an action to a store. The function will be given store's `dispatch` function.

#### Example

```ts
import {ReduxApp, Connect} from 'ng2redux';

import {increment, decrement} from './path-to-your-action-creators';
import {reducer} from './path-to-your-reducer';


@Connect({
    mapStateToProps: function(state) {
        return { counter: state };
    },
    mapDispatchToProps: function(dispatch) {
        return {
            onIncrement: () => {
                dispatch(increment());
            },
            onDecrement: () => {
                dispatch(decrement());
            }
        };
    }
})
@ReduxApp({
    selector: 'app',
    template: `<h1>Hello counter app!</h1>
    <button (click)="onIncrement()">Increment</button>
    <button (click)="onDecrement()">Decrement</button>
    <h2>{{counter}}</h2>
    `,
    reducer: reducer
})
export class AppComponent { }
```