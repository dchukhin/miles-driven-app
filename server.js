// server.js

//set up
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');

var configDB = require('./config/database.js');

//configuration
//connect to database
mongoose.connect(configDB.url);
//configure passport
require('./config/passport')(passport);

app.configure(function() {

	//set up our express application
	//show requests to console
	app.use(express.logger('dev'));
	//read cookies
	app.use(express.cookieParser());
	//info from HTML forms
	app.use(express.bodyParser());

	//templating language is EJS
	app.set('view engine', 'ejs');

	// required for passport
	app.use(express.session({ secret: 'secret' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

});

//routes
require('./app/routes.js')(app, passport);

//launch
app.listen(port);
console.log('The magic happens on port ' + port);


