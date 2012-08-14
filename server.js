// Setup mongoose and the database
// Check out ./config-sample to configure your MongoDb, rename it to config.js
var app = require('express');  
var server = app();
server.set('url', 'http://127.0.0.1:8080');

var mongoose = require('mongoose/');
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;

var config = require('./config'); // Local congig file to hide creds
db = mongoose.connect(config.creds.mongodb);
//var UserSchema = require('./schema'); 
crypto = require('crypto');

server.use('/public', app.static(__dirname + '/static'));
server.use('/css', app.static(__dirname + '/static/css/'));

server.use(app.cookieParser());
server.use(app.methodOverride());
server.use(app.session({ secret: 'keyboard cat' }));
server.use(app.bodyParser());
server.use(passport.initialize());
server.use(passport.session());

server.use(server.router);




var UserSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    psw:String,
    img: String
})
User = db.model('User', UserSchema);
var userApi = require('./user') 


/*Authentication*/

function findByUsername(username, fn) {
	console.log("finding user by: "+username)
	User.findOne({ 'name': username }, 'name psw', function (err, user) {
		  if (err){ 
		  	return fn(null, null); }
		  else    { 
		  	return fn(null, user); 
		  }
	});
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({ '_id': id }, 'name psw', function (err, user) {
		  done(err, user);
	});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	console.log("strategu")
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
     
      findByUsername(username, function(err, user) {
	        if (err) { return done(err); }
	        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
	        
	        var hash = crypto.createHash('sha1').update(password).digest("hex");
	        
	        if (user.psw != hash) { 
	        	console.log("invalid password")
	        	return done(null, false, { message: 'Invalid password' }); 
	        }
	        return done(null, user);
      })
    });
  }
));
/*end auth*/

/**
 * serve app root html
 */
function root(req, res, next){
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.sendfile(__dirname + '/static/templates/index.html');
}

function initdb(req, res, next){
 
  var user   = new User(); 
  User.collection.drop();
  console.log("dropping existing data...\n")
 
  user.name  = "tv";
  var hash = crypto.createHash('sha1').update("tv").digest("hex");
  user.psw   = hash;
  user.email = "tapio.vihanta@gmail.com"
  user.save(function(err){
  	console.log(err)
  });
  
  res.send({message: "added users"});
}

/**
 *  serve loginform
 *  TODO: see about backbone integration, async auth? 
 */
function loginForm(req,res,next)
{
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.sendfile(__dirname + '/static/templates/login.html');
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}

function ensureApiAuth(req,res,next){
	if (req.isAuthenticated()) { return next(); }
	else {res.done();}
}

// Set up our routes and start the server
server.get('/'     ,  ensureAuthenticated,root);
server.get('/login' , loginForm);
server.get('/init'  , initdb);

server.post('/api/login',   userApi.login);
server.get( '/api/logout', 	userApi.logout);
server.get( '/api/user'    ,userApi.getUser)
server.post('/api/user'    ,userApi.saveUser)
server.get( '/api/user/:id',userApi.getUser)
server.put( '/api/user/:id',userApi.saveUser)
server.delete('/api/user/:id', userApi.deleteUser)


var port = 8080;
server.listen(port, function() {
  console.log('%s listening at %s', server.name, "127.0.0.1:"+port);
});
