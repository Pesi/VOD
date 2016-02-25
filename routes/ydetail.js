var express = require('express');
var router = express.Router();

var ytinifnidata = require('../models/Ytinifni_import');

router.get('/:id*',function(req,res,next){
  ytinifnidata.getMetadata(req.params.id,function(err,data){
    if(err) {
      throw err;
    }
    res.render('ydetail',{title:data['title'],mdata:data});
  });
});

module.exports = router;
