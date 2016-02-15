var express = require('express');
var router = express.Router();

var metadata = require('../models/metadata');


router.get('/',function(req,res,next){

  //------------
  // prevede ytinifni strukturu na coreMetadata strukturu
  metadata.importYtinifni(function(err,mdata){
    res.render('ytinifni2core',{'content':JSON.stringify(mdata)});
  })
  //------------

});


module.exports = router;
