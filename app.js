var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var passport = require("passport");

var config = require("./config.js")
var app = express();




app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');



app.get("/",function(req,res){
  console.log(req)
	if(!req.session.user){
		res.redirect("/login");
	}else{
		res.render("home")
	}
})

var api = require('./routes/api');
app.use('/api', api());



app.get("/download/:id",function(req,res){

   res.set("Content-Type","application/octet-stream");

  searchFileSystem(req.params.id,function(files){
    for (var i = 0; i < files.length; i++) {
      if(files[i].indexOf(req.params.id) != -1){
         res.sendFile(process.cwd()+"/downloads/"+files[i]);
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
	res.send("<a href='/auth/google'>Sign In with Google</a>");
})



var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
 
  		return done(null,profile);
  }
));


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



app.listen(config.port);