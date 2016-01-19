var youtubedl = require("../ydl");
var db = require("../db")

module.exports = apiRoutes;

var express = require('express');


function apiRoutes(){
 var router = express.Router();


/*Start API routes*/
router.get("/search",function(req,res){
	searchAPI(req.query.q,function(d){
		res.send(d);
	})
})

var request = require("request");

function searchAPI(q,cb){
	var url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyC5l5beicijhdd8jWcorEqmXbZjMFCDrTc&part=snippet&type=video&q="+q;
	request.get(url,function(err,resp,body){
		cb(body);
	})
}



router.get("/download/:id",function(req,res){
  var id = req.params.id;
  youtubedl.downloadSong(id,function(done){
    res.send(done);

  })

});

router.delete("/collection/:id",function(req,res){
	var userid = req.session.user.id+"";
	var songid = req.params.id+"";
	db.removeFromUserCollection(userid,songid,function(err,data){
		res.send(data)
	})
	
})


router.post("/collection/",function(req,res){
  var songid = req.body.videoid+"";
  var songname = req.body.name+"";
  var thumb = req.body.thumb+"";
  var userid = req.session.user.id+"";
  searchFileSystem(songid,function(status){
  	if(status){
  		console.log("song exitis");
  	}else{
  		  youtubedl.downloadSong(songid,function(done){
    			console.log(songname+" download complete")

 		 })
  	}

  })
  db.addToCollection(songid,userid,songname,thumb,function(err,data){
  		console.log(data)
  		if(!err){
  			temp ={
  				name:data.name,
  				id:data.songid,
  				userid:data.userid,
  				thumb:data.thumb,
  				uri: "http://"+req.get('host')+"/download/"+data.songid+".mp3"
  			}
  			res.send(temp);
  		}else{
  			res.send(err);
  		}
  })
  

});


router.get("/getUserCollection/:id",function(req,res){
	var id = "";
	if(req.params.id && req.params.id != "auth"){
		id = req.params.id;
	}else if(req.params.id == "auth"){
		if(req.session.user.id){
			id=req.session.user.id;
		}else{
			res.send("This end point needs authentication")
		}
	}
	db.getUserCollection(id,function(err,data){
		if(!err){
			var result = [];
			for (var i = 0; i < data.length; i++) {
				var temp = {};
				temp.id= data[i].songid;
				temp.name =  data[i].name;
				temp.thumb =  data[i].thumb;
				temp.uri = "http://"+req.get('host')+"/download/"+data[i].songid+".mp3";
				result.push(temp)
			};
  			res.send(result);
  		}else{
  			res.send(err);
  		}
	})
})

return router;


	
}




function searchFileSystem(id,cb){

  fs = require('fs');

fs.readdir(process.cwd()+"/downloads", function (err, files) {
  if (err) {
    console.log(err);
    return;
  }
  for (var i = 0; i < files.length; i++) {
  	if(files[i].indexOf(id) != -1){
  		cb(true);
  		return;
  	}
  };

  cb(false)
});

}