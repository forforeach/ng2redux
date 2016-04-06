System.register("src/decorator", ["angular2/core", "./store-provider"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var core_1,
      store_provider_1;
  function ReduxApp(config) {
    if (config === void 0) {
      config = {
        reducer: null,
        providers: [],
        enhancers: []
      };
    }
    return function(cls) {
      var annotations = Reflect.getMetadata('annotations', cls) || [];
      var storeProvider = store_provider_1.StoreProvider.get(config.reducer, config.initialState, [window['devToolsExtension'] ? window['devToolsExtension']() : function(f) {
        return f;
      }].concat((config.enhancers || [])));
      config.providers = [storeProvider].concat((config.providers || []));
      var reduxMetadata = new core_1.ComponentMetadata(config);
      annotations.push(reduxMetadata);
      Reflect.defineMetadata('annotations', annotations, cls);
      return cls;
    };
  }
  exports_1("ReduxApp", ReduxApp);
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(store_provider_1_1) {
      store_provider_1 = store_provider_1_1;
    }],
    execute: function() {}
  };
});

System.register("src/utils/utils", [], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var isBoolean,
      isString,
      isNumber,
      isFunction,
      isDefined,
      isUndefined,
      isBlank,
      isObject,
      isArray,
      isTrueProperty;
  return {
    setters: [],
    execute: function() {
      exports_1("isBoolean", isBoolean = function(val) {
        return typeof val === 'boolean';
      });
      exports_1("isString", isString = function(val) {
        return typeof val === 'string';
      });
      exports_1("isNumber", isNumber = function(val) {
        return typeof val === 'number';
      });
      exports_1("isFunction", isFunction = function(val) {
        return typeof val === 'function';
      });
      exports_1("isDefined", isDefined = function(val) {
        return typeof val !== 'undefined';
      });
      exports_1("isUndefined", isUndefined = function(val) {
        return typeof val === 'undefined';
      });
      exports_1("isBlank", isBlank = function(val) {
        return val === undefined || val === null;
      });
      exports_1("isObject", isObject = function(val) {
        return typeof val === 'object';
      });
      exports_1("isArray", isArray = Array.isArray);
      exports_1("isTrueProperty", isTrueProperty = function(val) {
        return typeof val !== 'undefined' && val !== 'false';
      });
    }
  };
});

System.register("src/store", ["./utils/utils"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var utils_1;
  var Store;
  return {
    setters: [function(utils_1_1) {
      utils_1 = utils_1_1;
    }],
    execute: function() {
      Store = (function() {
        function Store(store, zone) {
          this.store = store;
          this.zone = zone;
        }
        Store.prototype.getReducer = function() {
          return this.store.getReducer();
        };
        Store.prototype.replaceReducer = function(nextReducer) {
          this.store.replaceReducer(nextReducer);
        };
        Store.prototype.dispatch = function(action) {
          return this.store.dispatch(action);
        };
        Store.prototype.getState = function() {
          return this.store.getState();
        };
        Store.prototype.subscribe = function(listener) {
          var _this = this;
          if (!utils_1.isFunction(listener)) {
            throw new Error('Expected listener to be a function');
          }
          return this.store.subscribe(function() {
            var state = _this.getState();
            _this.zone.run(function() {
              return listener(state);
            });
          });
        };
        return Store;
      }());
      exports_1("Store", Store);
    }
  };
});

System.register("src/store-provider", ["angular2/core", "redux", "./store"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var core_1,
      redux_1,
      store_1;
  var StoreProvider;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(redux_1_1) {
      redux_1 = redux_1_1;
    }, function(store_1_1) {
      store_1 = store_1_1;
    }],
    execute: function() {
      (function(StoreProvider) {
        var provider = null;
        var createProvider = function(reducer, initialState, storeEnhancers) {
          var enhancer = storeEnhancers ? redux_1.compose.apply(void 0, storeEnhancers) : null;
          var reduxStore = redux_1.createStore(reducer, initialState, enhancer);
          return core_1.provide(store_1.Store, {
            useFactory: function(zone) {
              return new store_1.Store(reduxStore, zone);
            },
            deps: [core_1.NgZone]
          });
        };
        StoreProvider.get = function(reducer, initialState, storeEnhancers) {
          return provider ? provider : provider = createProvider(reducer, initialState, storeEnhancers);
        };
      })(StoreProvider = StoreProvider || (StoreProvider = {}));
      exports_1("StoreProvider", StoreProvider);
    }
  };
});

System.register("src/container", [], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var Container;
  return {
    setters: [],
    execute: function() {
      Container = (function() {
        function Container() {
          this.unsubscribe = function() {};
        }
        Container.prototype.ngOnDestroy = function() {
          this.unsubscribe();
        };
        return Container;
      }());
      exports_1("Container", Container);
    }
  };
});

System.register("ng2redux", ["./src/decorator", "./src/store", "./src/store-provider", "./src/container"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  function exportStar_1(m) {
    var exports = {};
    for (var n in m) {
      if (n !== "default")
        exports[n] = m[n];
    }
    exports_1(exports);
  }
  return {
    setters: [function(decorator_1_1) {
      exportStar_1(decorator_1_1);
    }, function(store_1_1) {
      exportStar_1(store_1_1);
    }, function(store_provider_1_1) {
      exportStar_1(store_provider_1_1);
    }, function(container_1_1) {
      exportStar_1(container_1_1);
    }],
    execute: function() {}
  };
});
