

var id3 = require('id3js');




function showTags(filename){
	searchFileSystem(filename,function(files){
		    for (var i = 0; i < files.length; i++) {
		      if(files[i].indexOf(filename) != -1){
		         //res.sendFile();
		         console.log(files[i]);

		         writeTags("./downloads/"+files[i],{album:"Music Mojo",artist:"Thaikudam",title:"FishRock"},function(){

		        			id3({ file: "./downloads/"+files[i], type: id3.OPEN_LOCAL }, function(err, tags) {
									console.log(tags)
							});

		         })
		         return;
		      }
    
    	};
	})
}

function writeTags(filename,tags,cb){
	// Load and assign modules 
var id3 = require('id3-writer');
var writer = new id3.Writer();
 
var file = new id3.File(filename);
var meta = new id3.Meta({
    artist: tags.artist,
    title: tags.title,
    album: tags.album
});
 
writer.setFile(file).write(meta, function(err) {
 
    if (err) {
        console.log(err)
    }
    console.log("Done")
    cb();
});


}

showTags("2ItMh73QxWY");


function searchFileSystem(id,cb){

  fs = require('fs');

fs.readdir(process.cwd()+"/downloads", function (err, files) {
  if (err) {
    console.log(err);
    return;
  }
  cb(files)
});

}