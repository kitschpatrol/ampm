#! /usr/bin/env node

// Run ampm under nodemon in case ampm itself crashes.

var nodemon = require('nodemon');
var path = require('path');

var configFile = process.argv[2] || 'ampm.json';
var mode = process.argv[3] || '';
var appPath = path.resolve(path.dirname(configFile));

function start() {
    nodemon({
        script: path.join(__dirname, 'server.js'), // Run ampm's server.js
        verbose: true, // verbose doesn't seem to work?
        args: [configFile, mode], // Pass arguments on to ampm
        watch: [
            configFile.indexOf(',') !== -1 ? configFile.split(',') : configFile, // Restart when the ampm config file changes
            path.join(appPath, 'restart.json'), // Restart when ampm tries to tigger a restart itself.
            __dirname // Restart when ampm code changes, for doing development.
        ],
        ignore: [
            '.git', 'node_modules', 'logs', path.join(appPath, 'state.json')
        ]
    }).on('crash', start);
}
start();
