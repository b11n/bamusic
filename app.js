var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var jsonfile = require('jsonfile');
var compression = require('compression')


var config = require("./config.js")
var app = express();

    var request = require("request");


if(config.env == undefined || config.env == "development"){
  var webpack = require('webpack');
  var Wconfig = require('./webpack.config.js');
  var compiler = webpack(Wconfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: Wconfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}






app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use("/public/", compression())
app.use("/public/",function(req,res,next){
    //res.cookie("maxAge",604800000);
    res.append('Cache-Control', 'public,max-age=604800000');
    next();
});
app.use("/public/",express.static(__dirname + '/public'));




app.use(express.static(__dirname + '/public'));



var chunklist =  jsonfile.readFileSync("stats.json");
for(var i in chunklist){
  app.locals["hash"+i] = chunklist[i];
}

app.get("/new",function(req,res){
    res.render("new")
})

app.get("/",function(req,res){
  
	if(!req.session.user){
		res.redirect("/login");
	}else{
		res.render("new")
	}
})


app.get("/ba-sw.js",function(req,res){
  res.sendfile("./public/ba-sw.js")
  
});


app.get("/track/:id",function(req,res){

       var id = req.params.id;

        var url = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyC5l5beicijhdd8jWcorEqmXbZjMFCDrTc&part=snippet&type=video&id=" + id;
        request.get(url, function(err, resp, body) {
         
            res.render("track" ,{details:JSON.parse(body)});
        })
  
});

app.get("/related/:id",function(req,res){

       var id = req.params.id;

        var url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyC5l5beicijhdd8jWcorEqmXbZjMFCDrTc&part=snippet&maxResults=10&type=video&relatedToVideoId=" + id;
        request.get(url, function(err, resp, body) {
         
            res.send(body)
        })
  
})

var api = require('./routes/api');
app.use('/api', api());



app.get("/download/:id",function(req,res){

  res.set("Content-Type","application/octet-stream");

  var filename = req.query.filename+".mp3";

  searchFileSystem(req.params.id,function(files){
    for (var i = 0; i < files.length; i++) {
      if(files[i].indexOf(req.params.id) != -1){
         //res.sendFile();
         res.download(process.cwd()+"/downloads/"+files[i],filename)
         return;
      }
    };

    res.status(404).send({status:404})
  })

});


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


app.get("/login",function(req,res){
	res.render("login");
})

app.get("/registerNotif",function(req,res){
    res.redirect(config.notifServer+"?userid="+req.session.user.id);
})


app.get("/listen/:id",function(req,res){
    res.render("newplayer",{
      id:"http://" + req.get('host') + "/download/" + req.params.id + ".mp3"
    })
})


var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
  		return done(null,profile);
  }
));

var html_dir = './html/';
app.get("/BusSelect/Index",function(req,res){
	res.sendfile(html_dir + 'search.html');
});

app.get("/Seatlayout/Summary",function(req,res){
	res.sendfile(html_dir + 'search.html');
});


app.get("/mockscript.js",function(req,res){
	res.sendfile(html_dir + 'script.js');
});


app.get('/auth/google',
  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
   	req.session.user = req.user;
    res.redirect('/');
  });



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});




var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var ca		= fs.readFileSync('sslcert/gd_bundle-g2-g1.crt','utf8');
var credentials = {key: privateKey, cert: certificate,ca:ca};



var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(config.port);
//httpsServer.listen(config.sslport);
