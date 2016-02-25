var express = require('express');
var router = express.Router();

var buildmd = require('../models/buildMetadata');

router.get('/:id*',function(req,res,next){
  var locinfo, rtngs, people;
  var titleID = req.params.id;

  buildmd.getLocalizedInfo(titleID,function(err,data){
    if (err) throw err;
    locinfo = data;

    //add genres
    buildmd.getGenres(titleID,function(err,data){
      if (err) throw err;
      for(var i=0; i<locinfo.length; i++){
        locinfo[i].genres = data;
      }

      // add ratings
      buildmd.getRatings(titleID,function(err,data){
        if(err) throw err;
        var rtngs = data;

        //add people
        buildmd.getPeople(titleID,function(err,data){
          if(err) throw err;
          var people = data;

          //add metadata
          buildmd.getMetadata(titleID,function(err,data){
            if(err) throw err;
          var md = data;
          var metadata = md;
          metadata.localizedinfo = locinfo;
          metadata.ratings = rtngs;
          metadata.people = people;
          render(res,{metadata:metadata});
        });
        });
      });
    });

  });
});

function render(res,data) {
  //console.log(JSON.stringify(data,null,2));
  res.render('buildmd',data);
}

//add obj2 to obj1
function addObjToObj(obj1,obj2) {
  for(var key in obj2){
    obj1[key] = obj2[key];
  }
  return obj1;
}

module.exports = router;
