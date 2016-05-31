module.exports = function (config) {
    config.set({

        basePath: '',

        frameworks: ['jasmine'],

        files: [
            'node_modules/core-js/client/shim.min.js',

            'node_modules/reflect-metadata/Reflect.js',

            // System.js for module loading
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',

            // Zone.js dependencies
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',

            // RxJs.
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

            { pattern: 'node_modules/@angular/**/*.js', included: false, watched: true },
            { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: true },
            { pattern: 'node_modules/redux/dist/redux.js', included: true, watched: true },

            { pattern: 'karma-test-shim.js', included: true, watched: true },

            // paths loaded via module imports
            { pattern: 'src/**/*.js', included: false, watched: true },
            { pattern: 'tests/**/*.js', included: false, watched: true },

            // paths to support debugging with source maps in dev tools
            { pattern: 'src/**/*.ts', included: false, watched: true },
            { pattern: 'src/**/*.js.map', included: false, watched: false },
            { pattern: 'tests/**/*.ts', included: false, watched: true },
            { pattern: 'tests/**/*.js.map', included: false, watched: false }
        ],

        exclude: [],
        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            "/src/": "/base/src/",
            "/tests/": "/base/tests/",
            "/node_modules/": "/base/node_modules/"
        },
        preprocessors: {
            'src/**/!(*test).js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: 'coverage/'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
        singleRun: true
    })
}
