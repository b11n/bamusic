var youtubedl = require("../ydl");
var db = require("../db");
 var request = require("request");

module.exports = apiRoutes;

var express = require('express');


function apiRoutes() {
    var router = express.Router();


    /*Start API routes*/
    router.get("/search", function(req, res) {
        searchAPI(req.query.q, function(d) {
            res.send(d);
        })
    })

    router.get("/search/v2", function(req, res) {
        searchAPI(req.query.q, function(d) {
            var items = JSON.parse(d).items;
            var result = [];
            for (i = 0; i < items.length; i++) {

                result.push({
                    title: items[i].snippet.title,
                    thumb: items[i].snippet.thumbnails.high.url,
                    id: items[i].id.videoId
                });

            }
            res.send(result);
        })
    })


    router.post("/addtoplaylist",function(req,res){

        db.addToPlayist(req.body,function(err,data){
             res.send(data);
        })
       
    });

    router.post("/addgcmclient",function(req,res){
        db.addToClientIdList(req.body.clientid,function(err,data){
            res.send(data)
        })
    })

    router.get("/getLastestPush",function(req,res){
        db.getLastestPush(function(err,data){
            res.send(data)
        })
    })


    router.post("/insertPush",function(req,res){
         db.insertPush(req.body,function(err,data){
            res.send(data)
        })
    })


    router.post("/triggerPush",function(req,res){
/*        db.getAllGcmIds(function(err,data){
            request
        })*/


        request.post({
            url:"https://android.googleapis.com/gcm/send",
            json:true,
            body:{registration_ids:["fgDQ2JwkcUk:APA91bFFe7PfzLGm5dUg9IjfW5bv5aRq1PIUZHXhqkfsKxj6qIqt_fGLCgeTKx_4Y7QBLvAcKxEHLzK4F7wJvYpRmF2O-mAGnr9IpBuVL0BUNAnOXfiFbXF8wxs52gDorr_ggQu-Od89"]},
            headers:{
                "Authorization": "key=AIzaSyD3nQSAAJ9Mh3aTwgThho9jZuqWTi_smZU",
                "Content-Type": "application/json" 
            }
        },function(a,b,c){
            console.log(a)
            res.send(c);
        })

    })


    router.get("/video/:id", function(req, res) {
        var id = req.params.id;

        var url = "https://www.googleapis.com/youtube/v3/videos?key=AIzaSyC5l5beicijhdd8jWcorEqmXbZjMFCDrTc&part=snippet&type=video&id=" + id;
        request.get(url, function(err, resp, body) {
            res.send(body);
        })
    })






    var request = require("request");

    function searchAPI(q, cb) {
        var url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyC5l5beicijhdd8jWcorEqmXbZjMFCDrTc&part=snippet&type=video&q=" + q;
        request.get(url, function(err, resp, body) {
            cb(body);
        })
    }


    router.post("/share", function(req, res) {
        var payLoad = {
            fromuserid: req.session.user.id,
            touserid: req.body.touserid,
            songname: req.body.songname,
            thumb: req.body.thumb,
            songid: req.body.songid

        };
        db.addToShare(payLoad, function(err, data) {
            res.send(data)
        })
    });


    router.get("/share", function(req, res) {
        db.getUserShare(req.session.user.id, function(err, data) {
            res.send(data);

        })
    })

    router.get("/notif/:userid", function(req, res) {

        var userid = req.params.userid;
        db.getUserShare(userid, function(err, data) {
            res.send(data);

        })
    })

    router.delete("/collection/:id", function(req, res) {
        var userid = req.session.user.id + "";
        var songid = req.params.id + "";
        db.removeFromUserCollection(userid, songid, function(err, data) {
            res.send(data)
        })

    })


    router.get("/user/friends", function(req, res) {
        getFriends(req.session.user.id, req.session.user.accessToken, function(data) {
            res.send(data);
        })

    })

    router.post("/initializeDownload/:id", function(req, res) {

        searchFileSystem(req.params.id, function(status) {
            if (status) {
                console.log("song exitis");
                res.send({
                    success: true
                });
            } else {
                youtubedl.downloadSong(req.params.id, function(done) {
                    console.log(" download complete");
                    res.send({
                        success: true
                    });

                })
            }

        })

    })


    router.post("/collection/", function(req, res) {
        var songid = req.body.videoid + "";
        var songname = req.body.name + "";
        var thumb = req.body.thumb + "";
        var userid = req.session.user.id + "";
        searchFileSystem(songid, function(status) {
            if (status) {
                console.log("song exitis");
            } else {
                youtubedl.downloadSong(songid, function(done) {
                    console.log(songname + " download complete")

                })
            }

        })
        db.addToCollection(songid, userid, songname, thumb, function(err, data) {
            console.log(data)
            if (!err) {
                temp = {
                    name: data.name,
                    id: data.songid,
                    userid: data.userid,
                    thumb: data.thumb,
                    uri: "http://" + req.get('host') + "/download/" + data.songid + ".mp3"
                }
                res.send(temp);
            } else {
                res.send(err);
            }
        })


    });

    router.get("/checkTrackInUserCollection/:id", function(req, res) {
        var id = req.session.user.id;
        db.getUserCollection(id, function(err, data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].songid == req.params.id) {
                    res.send({
                        success: true
                    });
                    return;
                }
            };
            res.send({
                success: false
            });
        });
    });


    router.get("/getUserCollection/:id", function(req, res) {
        var id = "";
        if (req.params.id && req.params.id != "auth") {
            id = req.params.id;
        } else if (req.params.id == "auth") {
            if (req.session.user.id) {
                id = req.session.user.id;
                console.log(id);
            } else {
                res.send("This end point needs authentication")
            }
        }
        db.getUserCollection(id, function(err, data) {
            if (!err) {
                var result = [];
                for (var i = 0; i < data.length; i++) {
                    var temp = {};
                    temp.id = data[i].songid;
                    temp.name = data[i].name;
                    temp.thumb = data[i].thumb;
                    temp.uri = "//" + req.get('host') + "/download/" + data[i].songid + ".mp3";
                    result.push(temp)
                };
                res.send(result);
            } else {
                res.send(err);
            }
        })
    });


    router.get("/suggest", function(req, res) {
            console.log(req.query.q)
            searchAPI(req.query.q, function(data) {
                    res.send([req.query.q, 
                             ["Hello", "world"],
                            ["7,390,000 results", "17,900,000 results"],
                             ["http://example.com?q=sears","http://example.com?q=search+engines"]]
                            );
                    })
            });

        return router;



    } /*End of API routes function*/




    function searchFileSystem(id, cb) {

        fs = require('fs');

        fs.readdir(process.cwd() + "/downloads", function(err, files) {
            if (err) {
                console.log(err);
                return;
            }
            for (var i = 0; i < files.length; i++) {
                if (files[i].indexOf(id) != -1) {
                    cb(true);
                    return;
                }
            };

            cb(false)
        });

    }


    function getFriends(userid, accessToken, cb) {
       

        fetchFriends([], "init");

        function fetchFriends(list, pageToken) {
            if (pageToken == "init") {
                console.log("init")
                request("https://www.googleapis.com/plus/v1/people/" + userid + "/people/visible?access_token=" + accessToken, function(a, b, c) {
                    var parsedObj = JSON.parse(c);
                    list = parsedObj.items;
                    fetchFriends(list, parsedObj.nextPageToken)
                });
            } else if (pageToken) {

                request("https://www.googleapis.com/plus/v1/people/" + userid + "/people/visible?pageToken=" + pageToken + "&access_token=" + accessToken, function(a, b, c) {
                    var parsedObj = JSON.parse(c)
                    console.log(parsedObj)
                    list = list.concat(parsedObj.items);
                    fetchFriends(list, parsedObj.nextPageToken)
                });

            } else {
                cb(list);
            }
        }





    }