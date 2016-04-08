System.register("src/decorators/redux-app.decorator", ["angular2/core", "./../store", "./../provider"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var core_1,
      store_1,
      provider_1;
  function ReduxApp(config) {
    if (config === void 0) {
      config = {
        reducer: null,
        providers: [],
        enhancers: []
      };
    }
    return function(cls) {
      var store = store_1.getAppStore(config.reducer, config.initialState, [window['devToolsExtension'] ? window['devToolsExtension']() : function(f) {
        return f;
      }].concat((config.enhancers || [])));
      var annotations = Reflect.getMetadata('annotations', cls) || [];
      var storeProvider = provider_1.createProvider(store);
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
    }, function(store_1_1) {
      store_1 = store_1_1;
    }, function(provider_1_1) {
      provider_1 = provider_1_1;
    }],
    execute: function() {}
  };
});

System.registerDynamic("src/utils/object.assign", [], false, function($__require, $__exports, $__module) {
  var _retrieveGlobal = System.get("@@global-helpers").prepareGlobal($__module.id, null, null);
  (function() {
    if (typeof Object['assign'] !== 'function') {
      (function() {
        Object['assign'] = function(target) {
          'use strict';
          if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
          }
          var output = Object(target);
          for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
              for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                  output[nextKey] = source[nextKey];
                }
              }
            }
          }
          return output;
        };
      })();
    }
  })();
  return _retrieveGlobal();
});

System.register("src/decorators/connect.decorator", ["./../store", "./../utils/utils", "./../utils/object.assign"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var store_1,
      utils_1;
  var wrapDispatchMappings;
  function Connect(mappings) {
    return function(baseConstructor) {
      var mapToEmpty = function() {
        return ({});
      };
      var mapStateToProps = mappings.mapStateToProps || mapToEmpty;
      var mapDispatchToProps = mappings.mapDispatchToProps || mapToEmpty;
      if (baseConstructor.length > 19) {
        throw new Error("Cannot connect '" + baseConstructor.name + "' to Redux because\n            it has more than 19 dependencies");
      }
      var ReduxContainer = function(d0, d1, d2, d3, d4, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19) {
        var _this = this;
        var args = Array.apply(null, arguments).filter(function(x) {
          return x;
        });
        var ret = baseConstructor.apply(this, args);
        this.__extends = baseConstructor.name;
        var store = this.__store = args[args.length - 1];
        Object['assign'](this, mapStateToProps(store.getState()));
        this.__unsubscribe = store.subscribe(function() {
          var newState = store.getState();
          Object['assign'](_this, mapStateToProps(newState));
        });
        return ret;
      };
      ReduxContainer.prototype = baseConstructor.prototype;
      var finalDispatchmappings = wrapDispatchMappings(mapDispatchToProps());
      Object['assign'](ReduxContainer.prototype, finalDispatchmappings);
      var baseNgOnDestroy = ReduxContainer.prototype.ngOnDestroy;
      ReduxContainer.prototype.ngOnDestroy = function() {
        if (utils_1.isFunction(baseNgOnDestroy)) {
          baseNgOnDestroy.apply(this);
        }
        if (utils_1.isFunction(this.__unsubscribe)) {
          this.__unsubscribe();
        }
      };
      Reflect.getMetadataKeys(baseConstructor).forEach(function(key) {
        var metadata = Reflect.getMetadata(key, baseConstructor);
        if (key === 'design:paramtypes') {
          metadata = metadata || [];
          metadata.push(store_1.Store);
        }
        Reflect.defineMetadata(key, metadata, ReduxContainer);
      });
      return ReduxContainer;
    };
  }
  exports_1("Connect", Connect);
  return {
    setters: [function(store_1_1) {
      store_1 = store_1_1;
    }, function(utils_1_1) {
      utils_1 = utils_1_1;
    }, function(_1) {}],
    execute: function() {
      wrapDispatchMappings = function(dispatchMappings) {
        return Object.keys(dispatchMappings).reduce(function(state, key) {
          state[key] = function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i - 0] = arguments[_i];
            }
            args.push(this.__store.dispatch);
            dispatchMappings[key].apply(this, args);
          };
          return state;
        }, {});
      };
    }
  };
});

System.register("src/utils/utils", [], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var isFunction,
      isDefined,
      isUndefined,
      isBlank,
      isObject;
  return {
    setters: [],
    execute: function() {
      exports_1("isFunction", isFunction = function(val) {
        return typeof val === 'function';
      });
      exports_1("isDefined", isDefined = function(val) {
        return typeof val !== 'undefined';
      });
      exports_1("isUndefined", isUndefined = function(val) {
        return !isDefined(val);
      });
      exports_1("isBlank", isBlank = function(val) {
        return val === undefined || val === null;
      });
      exports_1("isObject", isObject = function(val) {
        return typeof val === 'object';
      });
    }
  };
});

System.register("src/store", ["redux", "./utils/utils"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var redux_1,
      utils_1;
  var store,
      createStoreWithEnhancersArray,
      getAppStore,
      Store;
  return {
    setters: [function(redux_1_1) {
      redux_1 = redux_1_1;
    }, function(utils_1_1) {
      utils_1 = utils_1_1;
    }],
    execute: function() {
      createStoreWithEnhancersArray = function(reducer, initialState, storeEnhancers) {
        var enhancer = storeEnhancers ? redux_1.compose.apply(void 0, storeEnhancers) : null;
        return redux_1.createStore(reducer, initialState, enhancer);
      };
      exports_1("getAppStore", getAppStore = function(reducer, initialState, storeEnhancers) {
        if (!store) {
          store = createStoreWithEnhancersArray(reducer, initialState, storeEnhancers);
        }
        return store;
      });
      Store = (function() {
        function Store(store, zone) {
          this.store = store;
          this.zone = zone;
          this.getReducer = store.getReducer;
          this.replaceReducer = store.replaceReducer;
          this.dispatch = store.dispatch;
          this.getState = store.getState;
          this.subscribe = function(listener) {
            if (!utils_1.isFunction(listener)) {
              throw new Error('Expected listener to be a function');
            }
            return store.subscribe(function() {
              var state = store.getState();
              zone.run(function() {
                return listener(state);
              });
            });
          };
        }
        Store.prototype.getReducer = function() {};
        ;
        Store.prototype.replaceReducer = function(nextReducer) {};
        ;
        Store.prototype.dispatch = function(action) {};
        Store.prototype.getState = function() {};
        Store.prototype.subscribe = function(listener) {};
        return Store;
      }());
      exports_1("Store", Store);
    }
  };
});

System.register("src/provider", ["angular2/core", "./store"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var core_1,
      store_1;
  var createProvider;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(store_1_1) {
      store_1 = store_1_1;
    }],
    execute: function() {
      exports_1("createProvider", createProvider = function(store) {
        return core_1.provide(store_1.Store, {
          useFactory: function(zone) {
            return new store_1.Store(store, zone);
          },
          deps: [core_1.NgZone]
        });
      });
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

System.register("ng2redux", ["./src/decorators/redux-app.decorator", "./src/decorators/connect.decorator", "./src/store", "./src/provider", "./src/container"], function(exports_1, context_1) {
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
    setters: [function(redux_app_decorator_1_1) {
      exportStar_1(redux_app_decorator_1_1);
    }, function(connect_decorator_1_1) {
      exportStar_1(connect_decorator_1_1);
    }, function(store_1_1) {
      exportStar_1(store_1_1);
    }, function(provider_1_1) {
      exportStar_1(provider_1_1);
    }, function(container_1_1) {
      exportStar_1(container_1_1);
    }],
    execute: function() {}
  };
});
