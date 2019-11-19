const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const exphbs = require('express-handlebars');
const favicon = require('serve-favicon');
const dotenv = require('dotenv');
const stripe = require('stripe')('pk_test_puuwTbVu3nSLRPLaOHboUXos');


require('./config/passport');
require('./config/facebook-login');
require('./config/google-login');

const apiRouter = require('./routes/api/fantipper');

const searchCitiesRouter = require('./routes/api/search-cities');
const searchUsernamesRouter = require('./routes/api/search_usernames');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const profileRouter = require('./routes/profile');
const logoutRouter = require('./routes/logout');
const exploreRouter = require('./routes/explore');
const learnRouter = require('./routes/learn');
const uploadImage = require('./routes/uploadImage');
const editFanProfile = require('./routes/editfanprofile');
const creatorProfile = require('./routes/creatorprofile');
const selectActiveCreator = require('./routes/selectactivecreator');
const tippingRouter = require('./routes/tippingRouter');
const messagRouter = require('./routes/tipmessage');

const profileEngineRouter = require('./routes/profileEngine')
const CreatorApplication = require('./routes/creatorProfileCreate');

const facebookRouter = require('./routes/facebook-login');
const googleRouter = require('./routes/google-login');

const fanTipHistory = require('./routes/fantiphistory');
const creatorTipHistory = require('./routes/creatortiphistory');

const stripeRouter = require('./routes/api/stripe');
// Test router for image upload

const test = require('./routes/creatorAppComplete');

// 

const categories_api = require('./routes/api/get_set_categories');
const fetch_tips_api = require('./routes/api/get_tips');
const fetch_fan_creator_messages = require('./routes/api/get_messages');

const app = express();
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon', 'favicon.ico')));

dotenv.config()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('.hbs', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'hbs', exphbs({
    defaultLayout: 'layout',
    layoutsDir: 'views/profile'
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'fantipper', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    if (req.isAuthenticated()) {

        res.locals.imagePath = req.user.imagepath;
        res.locals.email = req.user.email;
        res.locals.name = req.user.name;
        res.locals.description = req.user.description;
        res.locals.location = req.user.location;
        if (req.user.creator.isCreator) {
            var temp = req.user.creator.creatorAbout;
            temp = temp.replace(/['"]+/g, '');
            res.locals.isCreator = req.user.creator.isCreator;
            res.locals.CreatorName = req.user.creator.creatorName;
            res.locals.CreatorDescription = req.user.creator.creatorDesc;
            res.locals.CreatorUserName = req.user.creator.creatorNameuser;
            res.locals.CreatorURL = req.user.creator.creatorUrl;
            res.locals.CreatorDesc = req.user.creator.creatorDesc;
            res.locals.CreatorAbout = temp;
            res.locals.CreatorLocation = req.user.creator.creatorLocation;
            res.locals.facebookID = req.user.facebookID;
            res.locals.creatorTile = req.user.creator.creatorTileImage;
            res.locals.creatorBack = req.user.creator.creatorBack;
            res.locals.image1 = req.user.image1;
            res.locals.image2 = req.user.image2;
            // req.locals.categories = req.user.creator.creatorCategories;
        }
        res.locals.CardOption = req.user.card.isCard;
        if (req.user.card.isCard) {
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
app.use('/bloodhound', express.static(path.join(__dirname, 'node_modules/bloodhound/index.js')));


app.use('/socket', express.static(path.join(__dirname, 'node_modules/socket.io/lib')));
// Configuration to dropzone
app.use('/dropzone', express.static(path.join(__dirname, 'node_modules/dropzone/dist')));

// Configuration to cropper.js
app.use('/cropper', express.static(path.join(__dirname, 'node_modules/jquery-cropper/dist')));
app.use('/cropperjs', express.static(path.join(__dirname, 'node_modules/cropperjs/dist')));

app.use('/stripe', express.static(path.join(__dirname, 'node_modules/stripe/lib')))

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

app.use('/api/fantipper', apiRouter); // https://fantipper.herokuapp.com/api/fantipper/

app.use('/api/cities', searchCitiesRouter);
app.use('/api/username', searchUsernamesRouter);


app.use('/api/categories', categories_api);
app.use('/api/fetch_tips_api', fetch_tips_api);
app.use('/api/fancreatemsg', fetch_fan_creator_messages);

app.use('/creator/application', CreatorApplication);


// login with facebook and google plus
app.use('/login/facebook', facebookRouter);
app.use('/auth/google', googleRouter);

app.use('/messages', messagRouter);
app.use('/fantiphistory', fanTipHistory);
app.use('/creatortiphistory', creatorTipHistory);

app.use('/payment', stripeRouter);

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



mongoose.connect(process.env.MONGODB_URI,{useNewUrlParser : true});
// mongoose.connect('mongodb://localhost:27017/fantipper',{useNewUrlParser : true});
var db = mongoose.connection;
db.once('open', function() {
    console.log('Connection Successful');
});



module.exports = app;