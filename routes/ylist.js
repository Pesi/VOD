var express = require('express');
var router = express.Router();

var metadata = require('../models/metadata');

router.get('/',function(req,res,next){
  metadata.getList(function(err,data){
    if(err){
      throw err;
    }
    res.render('ylist',{title:'List of titles', mdata: data});

    //------------
    // prevede ytinifni strukturu na coreMetadata strukturu
    metadata.importYtinifni(function(err,mdata){
      console.log(mdata);
    })
    //------------
  });
});

module.exports = router;
