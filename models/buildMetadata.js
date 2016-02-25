
var coreMetadata = require('../models/metadata');

const IDENTIFIERS_VERSION = 1;
const IDENTIFIERS_ORG = "org:ytinifni.com"

function getLocalizedInfo(id,callback){
  coreMetadata.getTitle(id,function(err,data){
    if (err) callback(err);
    var ainfo = [];
    var locinfo = (data['localizedinfo']);
    for (var i = 0; i < locinfo.length; i++) {
      var info = {};
      info.locale = locinfo[i].locale;
      info.default = true;
      info.title = locinfo[i].title;
      info.titlesort = locinfo[i].title;
      info.synopsisLong = locinfo[i].synopsisLong;
      info.synopsisShort = locinfo[i].synopsisShort || makeShortText(locinfo[i].synopsisLong);
      info.arts = [
        {
          resolution:"584x800",
          id:getID("imageid",data.studioReleaseTitle,"art1.en")
        },
        {
          resolution:"800x800",
          id:getID("imageid",data.studioReleaseTitle,"art2.en")
        }
      ];
      info.keywords = [locinfo[i].title];
      ainfo.push(info);
    }
    callback(null,ainfo);
  });
}

function getGenres(id,callback) {
  coreMetadata.getTitle(id,function(err,data){
    if(err) callback(err);
    var genres = [];
    for (var i=0; i<data['genres'].length; i++) {
      genres.push(data.genres[i]);
    }
    callback(null,genres);
  });
}

function getRatings(id,callback){
  coreMetadata.getTitle(id,function(err,data){
    if(err) callback(err);
    /*
    var ratings = [];
    for(var i=0; i< data.ratings.length; i++) {
      ratings.push(data.ratings[i]);
    }
    */
    callback(null,data.ratings);
  });
}

function getPeople(id,callback){
  coreMetadata.getTitle(id,function(err,data){
    if(err) callback(err);
    callback(null,data.people);
  });
}

function getMetadata(id,callback){
  coreMetadata.getTitle(id,function(err,data){
    if(err) callback(err);
    var md = {};
    var drel = new Date(data.releaseDate);
    md.RunLength = "PTxxMxxS";
    md.CountryOfOrigin = data.CountryOfOrigin || "US";
    md.originalSpokenLanguage = data.originalSpokenLanguage;
    md.releaseYear = data.releaseYear;
    md.releaseDate = drel.getFullYear()+"-"+(drel.getMonth()+1)+"-"+ drel.getDate();
    md.WorkType = "movie";
    md.ColorType = "color";
    md.cid = getID("cid",data.studioReleaseTitle,"");
    callback(null,md);
  });
}

function makeShortText(text) {
  var maxLength = 190;
  if(text) {
    var trimedText = text.substr(0,maxLength);
    trimedText = trimedText.substr(0,Math.min(trimedText.length, trimedText.lastIndexOf(' ')));
    return trimedText;
  }
  return "";
}

function getID(type,name,postfix){
  if(typeof postfix === 'undefined') {
    postfix = "";
  } else {
    postfix = ":"+postfix;
  }
  var prefix = "md:"+type+":"+IDENTIFIERS_ORG+":"
  var orgID = name.replace(/[\s&,._-]/g,"").toLowerCase();
  return prefix + orgID + IDENTIFIERS_VERSION + postfix;
}


module.exports.getLocalizedInfo = getLocalizedInfo;
module.exports.getGenres = getGenres;
module.exports.getRatings = getRatings;
module.exports.getPeople = getPeople;
module.exports.getMetadata = getMetadata;
