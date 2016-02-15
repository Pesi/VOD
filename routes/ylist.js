var express = require('express');
var router = express.Router();

var metadata = require('../models/metadata');

router.get('/',function(req,res,next){
  metadata.getList(function(err,data){
    if(err){
      throw err;
    }
    res.render('ylist',{title:'List of titles', mdata: data});

  });
});

module.exports = router;
