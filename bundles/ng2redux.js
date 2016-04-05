System.register("src/decorator", ["angular2/core", "./store-provider"], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var core_1,
      store_provider_1;
  function ReduxApp(config) {
    if (config === void 0) {
      config = {
        reducer: null,
        providers: []
      };
    }
    return function(cls) {
      var annotations = Reflect.getMetadata('annotations', cls) || [];
      var storeProvider = store_provider_1.StoreProvider.get(config.reducer, config.initialState, [window['devToolsExtension'] ? window['devToolsExtension']() : function(f) {
        return f;
      }]);
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

System.register("src/store", [], function(exports_1, context_1) {
  var __moduleName = context_1 && context_1.id;
  var Store;
  return {
    setters: [],
    execute: function() {
      Store = (function() {
        function Store() {}
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
        StoreProvider.get = function(reducer, initialState, storeEnhancers) {
          return provider ? provider : provider = createProvider(reducer, initialState, storeEnhancers);
        };
        var createProvider = function(reducer, initialState, storeEnhancers) {
          var enhancer = storeEnhancers ? redux_1.compose.apply(void 0, storeEnhancers) : null;
          var store = redux_1.createStore(reducer, initialState, enhancer);
          return core_1.provide(store_1.Store, {useValue: store});
        };
      })(StoreProvider = StoreProvider || (StoreProvider = {}));
      exports_1("StoreProvider", StoreProvider);
    }
  };
});

System.register("ng2redux", ["./src/decorator", "./src/store", "./src/store-provider"], function(exports_1, context_1) {
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
    }],
    execute: function() {}
  };
});
