var express = require('express');
var router = express.Router();

/*
var probe = require('node-ffprobe');
var movie = '/Volumes/Stealing_Roses/sources/Stealing_Roses_FTR_1080_2398p_20en.mov';
var traier = '/Volumes/Stealing_Roses/sources/Stealing_Roses_TRL_1080_2398p_20en.mov';
*/
/* GET home page. */
router.get('/', function(req, res, next) {
/*
	probe(movie,function(err,probeData){
		res.render('index', { title: 'Express', movieinfo:probeData });
	})
*/
	res.render('index',{title:'Ytinifni metadata'});
});

module.exports = router;
