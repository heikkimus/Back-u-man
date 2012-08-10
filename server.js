// Setup mongoose and the database
// Check out ./config-sample to configure your MongoDb, rename it to config.js
var mongoose = require('mongoose/');
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;


console.log(userApi)
var config = require('./config'); // Local congig file to hide creds
db = mongoose.connect(config.creds.mongodb);
//var UserSchema = require('./schema'); 

// require restify and bodyParser to read Backbone.js syncs
var app = require('express');  
var server = app();
server.set('url', 'http://127.0.0.1:8080');
//server.use(restify.bodyParser());

server.use('/public', app.static(__dirname + '/static'));
server.use('/css', app.static(__dirname + '/static/css/'));
server.use(app.bodyParser());


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
	
	User.findOne({ 'name': 'Ghost' }, 'name psw', function (err, user) {
		  if (err){ return fn(null, null); }
		  else    { return fn(null, user); }
	});
	
 /* for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);*/
}

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      console.log("strategy")
      findByUsername(username, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
        if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
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
  
  user.name  = "seppo";
  user.psw   = "keppo";
  user.email = "tapio.vihanta@gmail.com"
  user.save(function(err){
  	console.log(err)
  });
  
  var user2   = new User(); 
  user2.name  = "seppo2";
  user2.psw   = "keppo3";
  user2.email = "seppo.vihanta@gmail.com"
  user2.save();
  console.log(function(err){
  console.log(err)
  });
  
  res.send({message: "added two users"});
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

/**
 *  Handle login data
 */
function login(req,res,next){
	passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Set up our routes and start the server
server.get('/'      , root);
server.get('/login' , loginForm);
server.post('/login',login);
server.get('/init'  , initdb);

server.get('/api/user'    , userApi.getUser)
server.get('/api/user/:id', userApi.getUser)
server.post('/api/user'   , userApi.saveUser)
server.put('/api/user/:id', userApi.saveUser)
server.delete('/api/user/:id', userApi.deleteUser)

server.listen(8081, function() {
  console.log('%s listening at %s', server.name, "127.0.0.1:8080");
});
