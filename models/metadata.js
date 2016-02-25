
var MONGO_DB = 'mongodb://localhost:27017/VOD_CoreMetadata';
var COLLECTION = 'coremetadata';

var mongoose = require('mongoose');

mongoose.connect(MONGO_DB);

var Schema = mongoose.Schema,
    coreMetadataSchema = require('./schema'),
    metadataSchema = new Schema(coreMetadataSchema.defCoreMetadataSchema,{collection:COLLECTION});

var coreMetadataModel = mongoose.model(COLLECTION,metadataSchema);

function getList(callback){
  coreMetadataModel.find({}).sort({studioReleaseTitle:1}).exec(function(err,doc){
    if (err) callback(err);
    var list = [];
    if(doc != null) {
      for(var k in doc){
        list.push({
          'id':doc[k]['_id'],
          'studioReleaseTitle':doc[k]['studioReleaseTitle'],
          'title':doc[k]['localizedinfo'][0]['title'],
          'releaseYear':doc[k]['releaseYear']
        });
      }
      callback(null,list);
    }
  });
}

function getTitle(idString,callback){
  coreMetadataModel.findOne({_id:idString},function(err,doc){
    if(err) callback(err);
    callback(null,doc.toObject());
  });
}

function insert(doc,callback){
  coreMetadataModel.remove(function(err,res){
    if(err) callback(err);
    coreMetadataModel.collection.insert(doc,function(err,result) {
      if (err) callback(err);
      callback(null,result);
    });
  });
}

module.exports.getList = getList;
module.exports.getTitle = getTitle;
module.exports.insert = insert;
