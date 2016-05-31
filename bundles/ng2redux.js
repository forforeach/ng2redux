System.register("src/decorators/redux-app.decorator", ["@angular/core", "./../store", "./../provider"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var core_1,
      store_1,
      provider_1;
  var getDebugEnhancer,
      getEnhancersByDebugMode;
  function ReduxApp(config) {
    if (config === void 0) {
      config = {reducer: null};
    }
    return function(cls) {
      var store = store_1.createStoreWithEnhancersArray(config.reducer, config.initialState, getEnhancersByDebugMode(config.debug, config.enhancers));
      var storeProvider = provider_1.createProvider(store);
      var providers = config.providers || [];
      config.providers = [storeProvider].concat(providers);
      var reduxComponentMetadata = new core_1.ComponentMetadata(config);
      var annotations = Reflect.getMetadata('annotations', cls) || [];
      annotations = annotations.concat([reduxComponentMetadata]);
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
    execute: function() {
      getDebugEnhancer = function() {
        return window['devToolsExtension'] ? window['devToolsExtension']() : function(f) {
          return f;
        };
      };
      getEnhancersByDebugMode = function(debug, enhancers) {
        if (enhancers === void 0) {
          enhancers = [];
        }
        return debug ? enhancers.concat([getDebugEnhancer()]) : enhancers;
      };
    }
  };
});

System.register("src/utils/object.assign", [], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  return {
    setters: [],
    execute: function() {
      exports_1("default", (function() {
        if (typeof Object['assign'] !== 'function') {
          Object['assign'] = function(target) {
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
        }
      })());
    }
  };
});

System.register("src/decorators/connect.decorator", ["./../store", "./../utils/utils", "./../utils/object.assign"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var store_1,
      utils_1;
  var updateStateToProps;
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
        Object.assign(this, updateStateToProps(store, mapStateToProps));
        Object.assign(this, mapDispatchToProps(store.dispatch));
        this.__unsubscribe = store.subscribe(function() {
          Object.assign(_this, updateStateToProps(store, mapStateToProps));
        });
        return ret;
      };
      ReduxContainer.prototype = baseConstructor.prototype;
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
          metadata = metadata.concat([store_1.Store]);
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
      updateStateToProps = function(store, mapStateToProps) {
        return mapStateToProps(store.getState());
      };
    }
  };
});

System.register("src/utils/utils", [], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var isFunction;
  return {
    setters: [],
    execute: function() {
      exports_1("isFunction", isFunction = function(val) {
        return typeof val === 'function';
      });
    }
  };
});

System.register("src/store", ["redux", "./utils/utils"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var redux_1,
      utils_1;
  var Store;
  function createStoreWithEnhancersArray(reducer, initialState, storeEnhancers) {
    var enhancer = storeEnhancers ? redux_1.compose.apply(null, storeEnhancers) : null;
    return redux_1.createStore(reducer, initialState, enhancer);
  }
  exports_1("createStoreWithEnhancersArray", createStoreWithEnhancersArray);
  return {
    setters: [function(redux_1_1) {
      redux_1 = redux_1_1;
    }, function(utils_1_1) {
      utils_1 = utils_1_1;
    }],
    execute: function() {
      ;
      Store = (function() {
        function Store(store, zone) {
          this.store = store;
          this.zone = zone;
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
        return Store;
      }());
      exports_1("Store", Store);
    }
  };
});

System.register("src/provider", ["@angular/core", "./store"], function(exports_1, context_1) {
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
