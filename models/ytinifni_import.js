var parser = require('csv-parse'),
    fs = require('fs'),
    mongodb = require('mongodb')
    ObjectID = mongodb.ObjectID,
    MongoClient = mongodb.MongoClient;

var mongodburl = 'mongodb://localhost:27017/vod';

var dbcollection = 'ytinifni';

var csvfile = 'sourcesdata/Ytinifni Metadata List -  JUNE1 2015.csv';
var csvoptions = {
	"delimiter" : ";",
	"rowDelimiter" : "\n"
};


function makeKeyName(txt) {
	var t = txt.trim();
	if (t.length > 0) {
		var nl = t.indexOf("\n");
		if (nl > 0) {
			t = t.substr(0, t.indexOf("\n"));
		}
	}
	t = t.trim();
	// remove brackets
	t = t.replace(/ *\([^)]*\) */g, "");
	t = t.replace(/ *\[[^)]*\] */g, "");
	// remove special chars
	t = t.replace(/[\.\*\?%,/]/g, "");
	t = t.replace(/#/, "No");
	t = t.replace(/[ -]/g, "_");
	t = t.toLocaleLowerCase();
	return t;
}

function separateItems(txt) {
	var t = txt.split('/');
	var rt = [];
	for (var i = 0; i < t.length; i++) {
		rt.push(t[i].trim());
	}
	return rt;
}

function separateGenres(txt) {
	var t = txt.split(/[,/]/);
	var rt = [];
	for (var i = 0; i < t.length; i++) {
		rt.push(t[i].trim());
	}
	return rt;
}

function csvread(csvfile){
	return fs.readFileSync(csvfile).toString();
}

// parse Ytinifni csv file and store data to mongodb in same structure
function csvparser(data){
	var csvout = new Array();
	var count = 0;
	parser(data,csvoptions,function(err,output){
		if(err) {
			throw err
		}
		var titlebar = [];
		output.forEach(function(title, i) {
			count++;
			if (title[0]) {
				var t = {};
				title.forEach(function(field, j) {
					if (i === 0) {
						// header line => key names
						var key = makeKeyName(field);
						var keymod = key;
						var k = 1;
						while (titlebar.indexOf(keymod) >= 0) {
							keymod = key + "_" + k++;
						}
						titlebar[j] = keymod;
					} else {
						if (field) {
							if (titlebar[j].indexOf("actor") > -1
							|| titlebar[j].indexOf("director") > -1
							|| titlebar[j].indexOf("producer") > -1
							|| titlebar[j].indexOf("writer") > -1
							|| titlebar[j].indexOf("cinematographer") > -1
							|| titlebar[j].indexOf("music_composer") > -1
							|| titlebar[j].indexOf("editor") > -1) {
								t[titlebar[j]] = separateItems(field);
							} else if (titlebar[j].indexOf("genre") > -1) {
								t[titlebar[j]] = separateGenres(field);
							} else {
								t[titlebar[j]] = field.trim();
							}
						}
					}
				});
				csvout.push(t);
			}
		});
		if(count == output.length) {
			savetodb(csvout,true);
		}
	});
}

function savetodb(csvout,removedata) {
	//console.log(csvout);
	MongoClient.connect(mongodburl,function(err,db){
		if(err){
			throw err;
		}
		console.log("Connection established to "+mongodburl);
		// save data to db
		var collection = db.collection('ytinifni');
    if(removedata){
      collection.remove({});
    }
		collection.insert(csvout, function(err,result){
			if(err) {
				console.log("dberr "+err);
				throw err;
			}
			console.log('Inserted %d documents into the "Ytinifni" collection. The documents inserted with "_id" are:', result.length, result);
			db.close();
		});
	});
}


// copy metadata from mongodb collection ytinifni
// ytinifni collection has same structure as ytinifni xls

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
        mdata.studioReleaseTitle = doc['title'];
        mdata.localizedinfo.push({
          locale:'en-US',
          title: doc['title'],
          synopsisLong: doc['synopsis']
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
        if(mdata.localizedinfo[0].title) {
          allMdata.push(mdata);
        }
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

module.exports.getList = getList;
module.exports.getMetadata = getMetadata;
module.exports.csvread = csvread;
module.exports.importYtinifni = importYtinifni;
