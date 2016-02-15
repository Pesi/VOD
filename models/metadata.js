
var mongodb = require('mongodb'),
ObjectID = mongodb.ObjectID,
MongoClient = mongodb.MongoClient,
mongodburl = 'mongodb://localhost:27017/vod',

mongoose = require('mongoose'),
Schema = mongoose.Schema;

var dbcollection = 'ytinifni';

var coreMetadataSchema = require('./schema');
var metadataSchema = new Schema(coreMetadataSchema.defCoreMetadataSchema);
var coreMetadataModel = mongoose.model('coreMetadata',metadataSchema);


function importYtinifni(callback){
  allMdata = [];
  MongoClient.connect(mongodburl,function(err,db){
    if (err) callback(err);
    var cursor = db.collection(dbcollection).find();
    cursor.each(function(err,doc){
      if (err) callback(err);
      if(doc){
        var mdata = {};
        mdata.provider = doc['studio_name'];
        mdata.localizedinfo = [];
        mdata.localizedinfo.push({
          locale:'en-US',
          title: doc['title'],
          synopsisLong: doc['sinopsis']
        });
        mdata.productionCompany = doc['production_company'];
        mdata.releaseYear = doc['estimated_production_year'];
        mdata.releaseDate = doc['street_date'];
        mdata.originalSpokenLanguage = doc['language'];
        var genres = doc['genrecategory'] || [];
        mdata.genres = [];
        for (var i=0; i<genres.length; i++) {
          mdata.genres.push({genre: genres[i]});
        }
        mdata.ratings = [];
        mdata.ratings.push({
          country: 'US',
          system: 'mpaa',
          rating: doc['mpaa']
        });
        mdata.people = [];
        var person = doc['principal_actors'] || [];
        for (var i=0; i<person.length; i++) {
          mdata.people.push({character:'Actor',name:person[i]});
        }
        var person = doc['director'] || [];
        for (var i=0; i<person.length; i++) {
          mdata.people.push({character:'Director',name:person[i]});
        }
        var person = doc['producer'] || [];
        for (var i=0; i<person.length; i++) {
          mdata.people.push({character:'Producer',name:person[i]});
        }
        var person = doc['writer'] || [];
        for (var i=0; i<person.length; i++) {
          mdata.people.push({character:'Writer',name:person[i]});
        }
        var person = doc['editor'] || [];
        for (var i=0; i<person.length; i++) {
          mdata.people.push({character:'Editor',name:person[i]});
        }
        var person = doc['cinematographer'] || [];
        for (var i=0; i<person.length; i++) {
          mdata.people.push({character:'Cinematographer',name:person[i]});
        }
        var person = doc['music_composer'] || [];
        for (var i=0; i<person.length; i++) {
          mdata.people.push({character:'Composer',name:person[i]});
        }
        allMdata.push(mdata);
      } else {
        db.close();
        callback(null,allMdata);
      }
    });
  });
}

// functions works with ytinifni database
function getList(callback) {
  var list = [];
  MongoClient.connect(mongodburl,function(err,db){
    if(err){
      throw err;
    }
    var collection = db.collection(dbcollection);
    var cursor = collection.find();
    cursor.sort({title:1});
    cursor.each(function(err,doc){
      //assert.equal(err,null);
      if(err) {
        callback(err);
      }
      if(doc != null) {
        list.push({'id':doc['_id'],'title':doc['title']});
      } else {
        db.close();
        callback(null,list);
      }
    });
  });
}

function getMetadata(idString,callback){
  MongoClient.connect(mongodburl,function(err,db){
    var objid = new ObjectID(idString);
    //console.log(objid);
    if(err){
      callback(err);
    }
    db.collection(dbcollection).findOne({_id: objid },function(err,cursor){
      callback(null,cursor);
    });
  });
}

module.exports.importYtinifni = importYtinifni;
module.exports.getList = getList;
module.exports.getMetadata = getMetadata;
