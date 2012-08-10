


function getUser(req, res, next)
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
}
module.exports.getUser = getUser;

function saveUser(req, res, next)
{
	console.log("saveUser");
	if (typeof req.params.id !== 'undefined')
	{
		User.findOne({'_id':req.body.id}, function(err, user){
			if(err){
				res.send({message: err});
				//res.send({error:err});
			}
			var u = user;
			saveChangedProperties(req.body, u)
			u.save();
			res.send(u);
		});
	}else {
		u = new User();
		saveChangedProperties(req.body, u)
		u.save();
		res.send(u);
	}
}
module.exports.saveUser = saveUser;

function deleteUser(req,res,next){
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
module.exports.deleteUser = deleteUser;
/**
 * save changed properties from request body to object.
 */
function saveChangedProperties(props, obj){
	for (var key in props) {
	  if (props.hasOwnProperty(key)) {
	    obj[key] = props[key]
	  }
	}
}