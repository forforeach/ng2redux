module.exports = function(config) {
    config.set({

        basePath: '',

        frameworks: ['jasmine'],

        files: [
            // paths loaded by Karma
            { pattern: 'node_modules/angular2/bundles/angular2-polyfills.js', included: true, watched: true },
            { pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true },
            { pattern: 'node_modules/rxjs/bundles/Rx.js', included: true, watched: true },
            { pattern: 'node_modules/angular2/bundles/angular2.js', included: true, watched: true },
            { pattern: 'node_modules/angular2/bundles/testing.dev.js', included: true, watched: true },
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
            "/tests/": "/base/tests/"
        },
        preprocessors: {
            'src/**/!(*test).js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
        singleRun: true
    })
}
