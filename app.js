const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');

const bodyParser = require('body-parser');
const helmet = require('helmet');

const createAllDir = require('./utils/createDir');
const cors = require('cors');//TODO В продакте обязательно удалить


const app = express();

app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'"]
  }
}));

//TODO В продакте обязательно удалить
cors({credentials: true, origin: true});
app.use(cors());


app.use(favicon(path.join(__dirname, 'public/img/', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



app.use(express.static(path.join(__dirname, 'public')));







require('./routes')(app);


createAllDir.createAllDir();


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(res.locals);
});

module.exports = app;
