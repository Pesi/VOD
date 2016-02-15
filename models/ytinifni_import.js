var parser = require('csv-parse'),
    fs = require('fs'),
    mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;
var mongodburl = 'mongodb://localhost:27017/vod';
