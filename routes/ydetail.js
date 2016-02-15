var express = require('express');
var router = express.Router();

var metadata = require('../models/metadata');

router.get('/:id*',function(req,res,next){
  metadata.getMetadata(req.params.id,function(err,data){
    if(err) {
      throw err;
    }
    res.render('ydetail',{title:data['title'],mdata:data});
  });
});

module.exports = router;
