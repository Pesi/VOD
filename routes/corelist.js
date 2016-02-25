var express = require('express');
var router = express.Router();

var coreMetadata = require('../models/metadata');

router.get('/',function(req,res,next){
  coreMetadata.getList(function(err,data){
    if(err) throw err;
    res.render('corelist',{title:'List of titles', mdata: data});
  });
});

module.exports = router;
