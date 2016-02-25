var express = require('express');
var router = express.Router();

var metadata = require('../models/metadata');

router.get('/:id*',function(req,res,next){
  metadata.getTitle(req.params.id,function(err,data){
    if(err) {
      throw err;
    }
    //res.send('<pre>'+JSON.stringify(data,null,4)+'</pre>');
    res.render('title',{title:data['studioReleaseTitle'],mdata:data});
  });
});

module.exports = router;
