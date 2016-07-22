'use strict';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db/inventoped.sqlite3');
module.exports = db;