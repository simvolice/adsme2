const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const useragent = require('express-useragent');
const createAllDir = require('./utils/createDir');




const app = express();





app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//TODO Потом надо добавить для кэша{"maxAge": "86400"}
app.use(express.static(path.join(__dirname, 'public')));

//TODO в продакте надо обязательно включить
/*app.use(helmet());
app.use(helmet.noCache());*/




app.use(useragent.express());

require('./routes')(app);









createAllDir.createAllDir();




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(res.locals);
});

module.exports = app;
