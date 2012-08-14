/**
 * save changed properties from request body to object.
 */
function saveChangedProperties(props, obj, fnDone){
	for (var key in props) {
	  if (props.hasOwnProperty(key)) {
	    if (key === "psw") {obj[key] = crypto.createHash('sha1').update(props[key]).digest("hex");}
	    else 	{
	    		obj[key] = props[key]
	    }
	  }
	}
	fnDone()
}

//module.exports.login = login;
module.exports = {
	
	login : function (req,res,next) {
		console.log(passport)
	    passport.authenticate('local', function(err,user,info) {
	    	    console.log(info)
	    	    if(err){
	    	    	console.log(err)
	    	    }
	            if(!user){
	            	res.send('0');
	            } 
	            if(user){
	            	 req.logIn(user, function(err) {
				      if (err) { return next(err); }
				      res.send('1');
				    });
	            	
	            } 
	    })(req,res,next);
	},
	
	logout : function(req, res){
	  req.logOut();
	  res.redirect('/#');
	},
	getUser: function(req, res, next)
	{
		if (typeof req.params.id !== 'undefined')
		{
			User.findOne({'_id':req.params.id}, function(err, user){
			if(err){
				res.send({error:err});
			}
				res.send(user);
			});
			
		}else {
			User.find('', function(err, users){
				if(err){
				res.send({error:err});
				}
				res.send(users);
			});
		}
	},
	
	saveUser:function (req, res, next)
	{
		if (typeof req.params.id !== 'undefined')
		{
			User.findOne({'_id':req.body.id}, function(err, user){
				if(err){
					res.send({message: err});
					//res.send({error:err});
				}
				var u = user;
				saveChangedProperties(req.body, u, function(){
					u.save();
					res.send(u);
				})
				
			});
		}else {
			u = new User();
			saveChangedProperties(req.body, u, function (){
				u.save();
				res.send(u);
			})
			
		}
	},
	
	deleteUser:function (req,res,next){
		console.log("deleteUser")
		if (typeof req.params.id !== 'undefined')
		{
			User.findOne({'_id':req.params.id}, function(err, user){
				if(err){
					res.send({message: err});
					//res.send({error:err});
				}
				var u = user;
				u.remove();
				res.send({message: "success"});
			});
		}
	}
}
