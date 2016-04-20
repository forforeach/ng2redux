declare var Reflect: any;

import {getAppStore, Store} from './../store';
import {isFunction} from './../utils/utils';
import './../utils/object.assign';


const wrapDispatchMappings = (dispatchMappings) => {
    return Object.keys(dispatchMappings).reduce((state, key) => {
        state[key] = function(...args) {
            args.push(this.__store.dispatch);
            dispatchMappings[key].apply(this, args);
        };
        return state;
    }, {});
};

export function Connect(mappings: {
    mapStateToProps?: Function,
    mapDispatchToProps?: Function
}) {
    return function(baseConstructor) {
        const mapToEmpty = () => ({});
        let mapStateToProps = mappings.mapStateToProps || mapToEmpty;
        let mapDispatchToProps = mappings.mapDispatchToProps || mapToEmpty;

        if (baseConstructor.length > 19) {
            // supposed to be VERY³ rare error
            throw new Error(`Cannot connect '${baseConstructor.name}' to Redux because
            it has more than 19 dependencies`);
        }

        /**
         * the new constructor behaviour
         * d0 - d19 is copied from angular source code.
         * it is a maximal amount of dependencies, that may be injected
         * into component.
         * https://github.com/angular/angular/blob/master/modules/angular2/src/core/di/injector.ts#L894
         **/
        var ReduxContainer: any = function(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10,
            d11, d12, d13, d14, d15, d16, d17, d18, d19) {

            // filter unijectded (empty) attributes
            let args = Array.apply(null, arguments).filter(x => x);
            let ret = baseConstructor.apply(this, args);
            // save base ctor name for debugging porpouse
            this.__extends = baseConstructor.name;
            let store = this.__store = args[args.length - 1];
            // initial mapping of props to newly created object
            // TS compiler still doesn't recognize Object.assign
            Object['assign'](this, mapStateToProps(store.getState()));
            // update props on every state update
            this.__unsubscribe = store.subscribe(() => {
                let newState = store.getState();
                Object['assign'](this, mapStateToProps(newState));
            });

            return ret;
        };
        // copy prototype so intanceof operator still works
        ReduxContainer.prototype = baseConstructor.prototype;
        // mapping actions to component events
        var finalDispatchmappings = wrapDispatchMappings(mapDispatchToProps());
        // map actions to a prototype of a component
        Object['assign'](ReduxContainer.prototype, finalDispatchmappings);

        // on component's destroy it should be unsubscribed from the redux store
        // retain user's base destroy logic
        let baseNgOnDestroy = ReduxContainer.prototype.ngOnDestroy;
        ReduxContainer.prototype.ngOnDestroy = function() {
            if (isFunction(baseNgOnDestroy)) {
                baseNgOnDestroy.apply(this);
            }
            if (isFunction(this.__unsubscribe)) {
                this.__unsubscribe();
            }
        };

        // copy all metadata that is defiened on base to extended constructor
        Reflect.getMetadataKeys(baseConstructor).forEach((key) => {
            let metadata = Reflect.getMetadata(key, baseConstructor);

            // automatically injects Store object as a last parameter
            if (key === 'design:paramtypes') {
                metadata = metadata || [];
                metadata.push(Store);
            }
            Reflect.defineMetadata(key, metadata, ReduxContainer);
        });

        // return extended ctor that will override base ctor
        return ReduxContainer;
    };
}