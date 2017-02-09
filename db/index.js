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


var PushInbox = mongoose.model('PushInbox',{
		body:String,
		title:String,
		icon:String,
});

var PushClients = mongoose.model('PushClients',{
		clienttoken:String
});


var Share  = mongoose.model("Share",{
	fromuserid:String,
	touserid:String,
	songid:String,
	thumb:String,
	songname:String
});


var Playlist  = mongoose.model("Playlist",{
	songid:String,
	songname:String,
	thumb:String,
	playlist_id:String,
	added_by:String
})

function addToPlayist(item,cb){
	var playlistItem = new Playlist(item);
	playlistItem.save(function(err,data){
		cb(null,data)
	});
}

function addToShare(inData,cb){


var shareItem = new Share(inData);
shareItem.save(function (err,data) {
  if (err){
  	cb(err,null);
  }else{
  	cb(null,data);
  }
 
});

}


function getUserShare(userid,cb){
	Share.find({touserid:userid},function(err,data){
		  if (err){
  			cb(err,null);
  		}else{
  			cb(null,data);
  		}
	})
}

function getLastestPush(cb){
	PushInbox.find({}, function(err, post) {

	   cb(null,post[post.length-1]);
	});
}

function insertPush(data,cb){
var kitty = new PushInbox(data);
kitty.save(function (err,data) {
  if (err){
  	cb(err,null);
  }else{
  	cb(null,data);
  }
 
});
}

function addToClientIdList(clientid,cb){


var kitty = new PushClients({ clienttoken : clientid });
kitty.save(function (err,data) {
  if (err){
  	cb(err,null);
  }else{
  	cb(null,data);
  }
 
});

}

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
	removeFromUserCollection:removeFromUserCollection,
	addToShare:addToShare,
	getUserShare:getUserShare,
	addToPlayist:addToPlayist,
	addToClientIdList:addToClientIdList,
	insertPush:insertPush,
	getLastestPush:getLastestPush

};