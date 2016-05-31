/* global __karma__, System*/
// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;


jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function () { };


System.config({
    packages: {
        'src': {
            defaultExtension: 'js',
            format: 'register',
            map: createModuleMap(onlyAppFiles)
        },
        'tests': {
            defaultExtension: 'js',
            format: 'register',
            map: createModuleMap(onlySpecFiles)
        },
        '@angular/core': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/compiler': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/common': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        '@angular/platform-browser-dynamic': {
            main: 'index.js',
            defaultExtension: 'js'
        },
        'rxjs': {
            defaultExtension: 'js'
        }
    },
    map: {
        'rxjs': 'node_modules/rxjs',
        '@angular': 'node_modules/@angular',
        'redux': 'base/node_modules/redux/dist/redux.js'
    }
});

Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
]).then(function (providers) {

    var testing = providers[0];
    var testingBrowser = providers[1];

    testing.setBaseTestProviders(testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
        testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);


    return Promise.all(
        Object.keys(window.__karma__.files) // All files served by Karma.
            .filter(onlySpecFiles)
            .map(filePath2moduleName)        // Normalize paths to module names.
            .map(function (moduleName) {
                // loads all spec files via their global module names (e.g. 'base/cds/hero.service.spec')
                return System.import(moduleName);
            }));
})
    .then(function () {
        __karma__.start();
    }, function (error) {
        console.error(error.stack || error);
    });


function createModuleMap(filter) {
    return Object.keys(window.__karma__.files)
        .filter(filter)
        .reduce(function createPathRecords(pathsMapping, appPath) {
            // creates local module name mapping to global path with karma's fingerprint in path, e.g.:
            // './hero.service': '/base/cds/hero.service.js?f4523daf879cfb7310ef6242682ccf10b2041b3e'
            var moduleName = filePath2moduleName(appPath);
            pathsMapping[moduleName] = appPath + '?' + window.__karma__.files[appPath];
            return pathsMapping;
        }, {})
}

function filePath2moduleName(filePath) {
    return filePath.replace(/\.js$/, '').replace('/base/', '');
}

function onlyAppFiles(filePath) {
    return /^\/base\/src\/.*\.js$/.test(filePath);
}

function onlySpecFiles(filePath) {
    return /^\/base\/tests\/.*\.js$/.test(filePath);
}
