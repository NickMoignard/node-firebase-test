/* 
	name: server.js
	the run down:
		base setup, grab all the packages we have installed
			instantiate our app
			configure app to use packages,
			set port for application

		base routes
		middleware, pretty basic. just apply morgan and it will
			log the HTTP request to console
		routes, add basic hello world route for debugging
			grab another router, apply routes to it (apiRouter)
		
		api routes!
		middleware, log specifically when an api route is accessed
		routes,
			/api/users GET: Return all the users in db
			/api/users POST: Create a user in the db
			/api/users/<user_id> GET: Return users info
			/api/users/<user_id> PUT: Update a users info
			/api/users/<user_id> DELETE: Delete a user
		start server!


*/

// BASE SETUP ================================================================

// CALL PACKAGES
var express = require('express'),
	app = express(),  //define our app using express
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose');

// set the port for our app
var port = process.env.PORT || 8080; 

// get user model
var User = require('./app/models/users');


// CONFIGURE APP

// body parser, to grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// configure app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POSTS');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, \
		content-type, Authorization');
	next();
});

// connect to the local database
mongoose.connect('mongodb://localhost:27017/node_test');



// BASE APP ==================================================================
// MIDDLEWARE 
app.use(morgan('dev'));  // log all requests to the console

// BASE ROUTES 
app.get('/', function(req, res) {
	res.send('welcome to the home page!');
});



// API =======================================================================
var apiRouter = express.Router();  // get an express router

// API MIDDLEWARE ============================================================
apiRouter.use(function(req, res, next) {
	console.log("someone just came to the app");
	// this is where we authenticate users
	next();
});

// API Routes =================================================================
apiRouter.get('/', function(req, res) {
	res.json({ message: 'woah check out this json'});
});

apiRouter.route('/users')
	//create a user
	.post(function(req, res) {
		// instantiate user model
		var user = new User();

		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password

		user.save(function(err) {
			if (err) {
				//duplicate entry
				if (err.code == 11000)
					return res.json({ success: false, message: "username taken" });
				else
					return res.send(err);
			}
			res.json({message: "user created!"});
		});
	})

	// get all the users
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) res.send(err);
			// return the users
			res.json(users);
		});
	});

// Single User Routes
apiRouter.route('/users/:user_id')

	.get(function(req, res) {
		// GET USER INFO
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);
			res.json(user);
		});
	})
	.put(function(req, res) {
		// UPDATE USER INFO
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);

			// update only parameters sent in request
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			user.save(function(err) {
				if (err) res.send(err);
				res.json({message:"User updated!"});
 			});
		});
	})
	.delete(function(req, res) {
		// DELETE USER
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err) res.send(err);
			res.json({message: "User Deleted"})
		} );
	});

// Register our routes - all routes prefixed with /api
app.use('/api', apiRouter);


//START THE SERVER ===========================================================
app.listen(port);
console.log('port: '+ port);




















