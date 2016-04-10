var pkg = require('./package.json');
var path = require('path');
var Builder = require('systemjs-builder');
var name = pkg.name;

var bundlePath = path.resolve(__dirname, 'bundles/', name);

var builder = new Builder();
var config = {
    baseURL: '.',
    transpiler: 'typescript',
    typescriptOptions: {
        module: 'cjs'
    },
    map: {
        typescript: './node_modules/typescript/lib/typescript.js',
        angular2: path.resolve('node_modules/angular2'),
        redux: path.resolve('node_modules/redux/lib'),
        rxjs: path.resolve('node_modules/rxjs')
    },
    paths: {
        '*': '*.js'
    },
    meta: {
        'node_modules/angular2/*': { build: false },
        'node_modules/rxjs/*': { build: false },
        'node_modules/redux/*': { build: false }
    },
};

builder.config(config);

Promise.all([
    builder.bundle(name, bundlePath + '.js'),
    builder.bundle(name, bundlePath + '.min.js', {
        minify: true,
        sourceMaps: true,
        mangle: false
    })
])
    .then(function() {
        console.log('Build complete.');
    })
    .catch(function(err) {
        console.log('Error', err);
    });