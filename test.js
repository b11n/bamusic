var Gracenote = require("node-gracenote");
var clientId = "1837313876-5B0F84042DCA9C8D27A4DBD0E1381BB7";
var clientTag = "5B0F84042DCA9C8D27A4DBD0E1381BB7";
var userId = null;
var api = new Gracenote(clientId,clientTag,userId);
api.register(function(err, uid) {
   userId = uid
   console.log(uid)
   search();
});


function search(str){
	var api = new Gracenote(clientId,clientTag,userId);
api.searchTrack("Neram (Malayalam)  - Vaathil Melle Video Song _ Nivin, Nazriya Nazim-r3fhuJJRcYc","","", function(err, result) {
    console.log(result)
});
}