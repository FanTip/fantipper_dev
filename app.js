var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const exphbs = require('express-handlebars');
var favicon = require('serve-favicon');
var dotenv = require('dotenv');

require('./config/passport');
require('./config/facebook-login');
require('./config/google-login');

var apiRouter = require('./routes/api/fantipper');
var searchCitiesRouter = require('./routes/api/search-cities');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var profileRouter = require('./routes/profile');
var logoutRouter = require('./routes/logout');
var exploreRouter = require('./routes/explore');
var learnRouter = require('./routes/learn');
var uploadImage = require('./routes/uploadImage');
var editFanProfile = require('./routes/editfanprofile');
var creatorProfile = require('./routes/creatorprofile');
var selectActiveCreator = require('./routes/selectactivecreator');
var tippingRouter = require('./routes/tippingRouter');
var messagRouter = require('./routes/tipmessage');

var profileEngineRouter = require('./routes/profileEngine')
var CreatorApplication = require('./routes/creatorProfileCreate');

var facebookRouter = require('./routes/facebook-login');
var googleRouter = require('./routes/google-login');

var fanTipHistory = require('./routes/fantiphistory');
var creatorTipHistory = require('./routes/creatortiphistory');

// Test router for image upload

var test = require('./routes/creatorAppComplete');

// 

var app = express();
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon', 'favicon.ico')));

dotenv.config()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('.hbs', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'hbs', exphbs({
  defaultLayout : 'layout',
  layoutsDir : 'views/profile'
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'fantipper', resave:false, saveUninitialized: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  if(req.isAuthenticated()){
    
    res.locals.imagePath = req.user.imagepath;
    res.locals.email = req.user.email;
    res.locals.name = req.user.name;
    res.locals.description = req.user.description;
    res.locals.location = req.user.location;
    if(req.user.creator.isCreator){
      var temp = req.user.creator.creatorAbout;
      temp = temp.replace(/['"]+/g, '');
      console.log(req.user.creator.creatorAbout);
      console.log(temp);
      res.locals.isCreator = req.user.creator.isCreator;
      res.locals.CreatorName = req.user.creator.creatorName;
      res.locals.CreatorDescription = req.user.creator.creatorDesc;
      res.locals.CreatorUserName = req.user.creator.creatorNameuser;
      res.locals.CreatorURL = req.user.creator.creatorUrl;
      res.locals.CreatorDesc = req.user.creator.creatorDesc;
      res.locals.CreatorAbout = temp;
      res.locals.facebookID = req.user.facebookID;
      res.locals.creatorTile = req.user.creator.creatorTileImage;
      res.locals.creatorBack = req.user.creator.creatorBack;
      res.locals.image1 = req.user.image1;
      res.locals.image2 = req.user.image2;
    }
    if(req.user.card.isCard){
      res.locals.cardOptions = req.user.card.isCard;
      res.locals.cardName = req.user.card.cardName;
      res.locals.cardNumber = req.user.card.cardNumber;
      res.locals.cardExp = req.user.card.cardExpNum;
      res.locals.cardCVV = req.user.card.cvvNum;
    }
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', 'api-key,content-type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});



// Path to Quill
app.use('/quill', express.static(path.join(__dirname, 'node_modules/quill/dist')));

// Path to typeahead and bloodhound tokenizer
app.use('/typeahead', express.static(path.join(__dirname, 'node_modules/typeahead.js/dist')));
app.use('/bloodhound', express.static(path.join(__dirname,'node_modules/bloodhound/index.js')));


app.use('/socket', express.static(path.join(__dirname, 'node_modules/socket.io/lib')));
// Configuration to dropzone
app.use('/dropzone', express.static(path.join(__dirname, 'node_modules/dropzone/dist')));

// Configuration to cropper.js
app.use('/cropper', express.static(path.join(__dirname, 'node_modules/jquery-cropper/dist')));
app.use('/cropperjs', express.static(path.join(__dirname, 'node_modules/cropperjs/dist')));

app.use('/', indexRouter);
app.use('/upload', uploadImage);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/profile', profileRouter);
app.use('/logout', logoutRouter);
app.use('/learn', learnRouter);
app.use('/explore', exploreRouter);
app.use('/editfanprofile', editFanProfile);
app.use('/creatorprofile', creatorProfile);
app.use('/selectactivecreator', selectActiveCreator);
app.use('/tipping', tippingRouter);
app.use('/fantipper', profileEngineRouter)

app.use('/api/fantipper', apiRouter);
app.use('/api/cities', searchCitiesRouter);

app.use('/creator/application', CreatorApplication);


// login with facebook and google plus
app.use('/login/facebook', facebookRouter);
app.use('/auth/google', googleRouter);

app.use('/messages', messagRouter);
app.use('/fantiphistory', fanTipHistory);
app.use('/creatortiphistory', creatorTipHistory);

app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  res.render('pagenotfound');
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// mongoose.connect(process.env.MONGODB_URI);
mongoose.connect('mongodb://localhost:27017/fantipper');
let db = mongoose.connection;
db.once('open', function(){
  console.log('Connection Successful');
});



module.exports = app;
