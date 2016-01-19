module.exports = {
	downloadSong:downloadSong
}

function downloadSong(id,cb){

	var exec = require('child_process').exec;
	var cmd = 'youtube-dl --extract-audio --audio-format mp3 -o "./downloads/%(title)s-%(id)s.%(ext)s" https://www.youtube.com/watch?v='+id;

	var c = exec(cmd, function(error, stdout, stderr) {
	  console.log(stdout);
	  cb({success:true});
	});

	c.stdout.on('data', function(chunk) {
	  console.log(chunk);
	});


	return c;


}




