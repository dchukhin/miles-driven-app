// app/routes.js
var mongoose = require('mongoose');
var Record = require('./models/record');

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
        // we also load the records from database so that they can be displayed
        app.get('/profile', isLoggedIn, function(req, res) {
	    Record.find().sort({
            year : -1, 
            month : -1, 
            dayofmonth : -1
        }).exec(function(err, records){
    		res.render('profile.ejs', {
    	            user : req.user,
    	            records : records
	        });
	    });
	});
	
	//ADD A RECORD TO DB
	app.post('/addrecord', function(req,res){
	    new Record({
	        username : req.user.local.username,
	        dayofmonth : req.body.dayofmonth,
	        month : req.body.month,
	        year : req.body.year,
	        miles : req.body.miles,
	        hours : req.body.hours
	    }).save(function(err, record){
	        res.redirect('/profile');
	    });
	});
	
        //UPDATE OUTPUT FROM DB
	app.post('/update', isLoggedIn, function(req, res){
	    Record.find({
	        "dayofmonth":{$gte : req.body.fromdayofmonth, $lte : req.body.todayofmonth},
	        "month":{$gte : req.body.frommonth, $lte : req.body.tomonth},
	        "year":{$gte : req.body.fromyear, $lte : req.body.toyear}
	    }).sort({
	        year : -1,
	        month : -1,
	        dayofmonth : -1
	    }).exec(function(err, records){
	        res.render('profile.ejs',{
	            user : req.user,
	            records : records
	        });
	    });
	});

	//DELETE A RECORD
        app.get('/delete/:id', function (req,res){
	    Record.findById(req.params.id, function(err, record){
		record.remove(function(err, record){
		    res.redirect('/profile');
		});
	    });
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


