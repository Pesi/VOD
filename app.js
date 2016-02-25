var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var reactViews = require('express-react-views');
//var engines = require('consolidate');

var routes = require('./routes/index');
var users = require('./routes/users');
var ylist = require('./routes/ylist');
var ydetail = require('./routes/ydetail');
var ytinifni2core = require('./routes/ytinifni2core');
var loadcsv = require('./routes/loadcsv');
var corelist = require('./routes/corelist');
var title = require('./routes/title');
var buildmd = require('./routes/buildmd');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.engine('jsx',require('express-react-views').createEngine());
//app.engine('jsx',engines.react);
//app.engine('ejs',engines.ejs);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/ylist', ylist);
app.use('/ydetail', ydetail);
app.use('/ytinifni2core', ytinifni2core);
app.use('/loadcsv', loadcsv);
app.use('/corelist', corelist);
app.use('/title', title);
app.use('/buildmd', buildmd);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

console.log(process.versions);

module.exports = app;
