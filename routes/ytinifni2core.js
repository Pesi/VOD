var express = require('express');
var router = express.Router();

var ytinifnidata = require('../models/Ytinifni_import');
var metadata = require('../models/metadata');


router.get('/',function(req,res,next){

  //------------
  // prevede ytinifni strukturu na coreMetadata strukturu
  ytinifnidata.importYtinifni(function(err,mdata){
    metadata.insert(mdata,function(err,storedData) {
      if (err) throw err;
      res.render('ytinifni2core',{'content':storedData});
    });
  })
  //------------

});


module.exports = router;
