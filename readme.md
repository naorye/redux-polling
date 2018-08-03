# Create Node Module
> Easy to use node module boilerplate with ready to use npm scripts, babel, jest and readme template

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
<!-- [![Downloads Stats][npm-downloads]][npm-url] -->

Instead of writing my boilerplate code every new node module I make, I decided to create an easy to use node module boilerplate that let my go straight to the point and develop my module.

## npm scripts
This module supports the following npm scripts:
1.  

    "start": "npm run dev",
    "dev": "npm test -- -w",
    "init": "mkdir dist",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean && npm run init",
    "build": "./node_modules/.bin/babel ./src -d ./dist --ignore test.js",
    "pretest": "npm run build",
    "test": "./node_modules/.bin/jest --coverage",
    "prepublish": "npm run test",
    "coveralls": "cat coverage/lcov.info | ./node_modules/.bin/coveralls"