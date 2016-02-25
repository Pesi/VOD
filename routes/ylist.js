var express = require('express');
var router = express.Router();

var ytinifnidata = require('../models/Ytinifni_import');

router.get('/',function(req,res,next){
  ytinifnidata.getList(function(err,data){
    if(err){
      throw err;
    }
    res.render('ylist',{title:'List of titles', mdata: data});

  });
});

module.exports = router;
