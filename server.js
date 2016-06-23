/* 
	name: server.js

*/

// BASE SETUP ================================================================

// Call Packages
var express = require('express'),
	app = express(),  //define our app using express
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	mongoose = require('mongoose');

//set the port for our app
var port = process.env.PORT || 8080; 

// Configure App:
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
mongoose.connect('mongodb://localhost:27017/node_test')

// MIDDLEWARE ================================================================
// log all requests to the console
app.use(morgan('dev'));

// API ROUTES ================================================================

// Home page
app.get('/', function(req, res) {
	res.send('welcome to the home page!');
});

// get an express router
var apiRouter = express.Router();

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'woah check out this json'});
});

// additonal routes will occur here

// Register our routes - all routes prefixed with /api
app.use('/api', apiRouter);

//START THE SERVER ===========================================================
app.listen(port);
console.log('port: '+ port);




















