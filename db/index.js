var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds047305.mongolab.com:47305/ytmusic');

var Songs = mongoose.model('Songs', { 
		name: String,
		id: String

});

var Users = mongoose.model('Users', { 
		name: String,
		id: String,

});

var Collections = mongoose.model('Collections',{
		userid:String,
		songid:String,
		name:String,
		thumb:String

});



function addToCollection(songid,userid,name,thumb,cb){


var kitty = new Collections({ userid: userid,songid:songid,name:name,thumb:thumb });
kitty.save(function (err,data) {
  if (err){
  	cb(err,null);
  }else{
  	cb(null,data);
  }
 
});

}


function getUserCollection(userid,cb){
	Collections.find({userid:userid},function(err,data){
		  if (err){
  			cb(err,null);
  		}else{
  			cb(null,data);
  		}
	})
}

function removeFromUserCollection(userid,songid,cb){
	Collections.remove({ userid: userid,songid:songid }, function (err,data) {
  		if (err) {
  			cb(err);
  		}
  		cb(null,data)
	});
}

module.exports = {
	addToCollection:addToCollection,
	getUserCollection:getUserCollection,
	removeFromUserCollection:removeFromUserCollection
};