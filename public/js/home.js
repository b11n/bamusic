$(".input-el").on("click",function(){
	$(".input-box").addClass("expand");
	$(".search-overlay").addClass("show");
	$(".search-icon-el").removeClass("fa-search").addClass("fa-arrow-left");
	$(".clear-btn-el").show();
	

});

$(".input-el").on("keyup",function(){
	$.ajax({
		url:"api/search?q="+this.value,
		success:function(data){
							$(".search-results").html("");
			var items = JSON.parse(data).items
			for (var i = 0; i < items.length; i++) {
				var temp = $($("#cardTemplate").html())
				temp.find(".thumb").css("background-image","url("+items[i].snippet.thumbnails.default.url+")");
				temp.find(".title").html(items[i].snippet.title.split("-")[0])
				temp.find(".channel").html(items[i].snippet.title.split("-")[1])
				bindContextMenuClick(items[i],temp,[{
					title:"Add",
					callback:function(data){
						console.log("add to collection",data)
					}
				},{
					title:"Play",
					callback:function(data){

						var playerData = {
						"id":data.id.videoId,
						"name":data.snippet.title,
						"thumb":data.snippet.thumbnails.default.url,
						"uri":"http://bamusiclocal.com/download/"+data.id.videoId+".mp3"
					};
						player.play(playerData)
					}
				}])
				$(".search-results").append(temp)
			};
		}
	})

});



	$(".bodyel").css("width",window.innerWidth+"px")



$(".search-icon-el").on("click",function(){
	if($(this).hasClass("fa-arrow-left")){
		hideOverlay();
	}
})

$(".clear-btn-el").on("click",function(){
	$(".input-el").val("")
})


$(".tab").on("click",function(){
	var i = parseInt($(this).attr("data-index"));
	console.log(window.innerWidth)
	$(".tabSelect").css("left",i*33.3+"%");
	$(".bodyelWrap").css("transform","translateX(-"+i*window.innerWidth+"px)");
});







$('body').on("click",function(e){
	if($(e.target).hasClass("context-menu") || $(e.target).parent().hasClass("context-menu")){

	}else{
	  $(".context-menu").removeClass("open");
	  e.stopPropagation();
	}

});



$(".player-group").on("click",function(e){
	requestAnimationFrame(function(){
		$(".ripple").addClass("open");
		$(".player").css("bottom","100%").css("opacity",0);
	})
	
	
});

$("#minimize").on("click",function(){
	requestAnimationFrame(function(){
		$(".ripple").removeClass("open");
		$(".player").css("bottom","0px").css("opacity",1);
	})
})

$(".bodyEl").on("touchstart",function(e){
 console.log(e)
});

initializeCollection();


new Dragdealer('b', {
  steps: 3,
  speed: 1,
  loose: false,
  requestAnimationFrame: true,
  callback:function(){
  	
  	$(".tabSelect").css("left",(this.getStep()[0]-1)*33.3+"%");
  }
});

function Player(){

	this.audioEl =$("audio")[0];
	var audioEl = this.audioEl;
	var _this = this;
	var dragging = false;

	var playing = false;

	this.audioEl.onerror = function(e){
			/*showLoader();*/
		
			initilizeDownload(_this.id,function(){
				_this.audioEl.setAttribute("src","/download/"+_this.id+".mp3");
				/* hideLoader();*/
				_this.audioEl.play();

			});
			

		}

	var dd = new Dragdealer('a',{
		vertical:false,
		steps:100,
		slide:false,
		dragStartCallback:function(){
			dragging = true;
		},
		dragStopCallback:function(x,y){
			dragging = false;
			audioEl.currentTime = x*audioEl.duration;
			dd.setStep(Math.ceil(x*100),0);
		}
	});

	$(".seek-button")[0].addEventListener("touchstart", function(e){
		$(".seek-button").addClass("large")
	})

	$(".seek-button")[0].addEventListener("touchend", function(e){
		$(".seek-button").removeClass("large")
	})

	$(".play-pause").on("click",function(){
		if(playing){
			$("#playpause").removeClass("fa-pause").addClass("fa-play");
			$("audio")[0].pause();
		}else{
			$("#playpause").removeClass("fa-play").addClass("fa-pause");
			$("audio")[0].play();
		}
		playing = !playing;
	}.bind(this))


	this.play = function(song){
		updateUI(song);
		this.id = song.id;
		playSong(song.id);
		showPlayer();
	}

	this.pause = function(){
		$("audio")[0].pause();
	}

	function showPlayer(){
		$(".player").css("bottom","0px");
	}

	function updateUI(data){
		$(".player .player-thumb").css("background-image","url("+data.thumb+")");

		$(".maincard .backdrop").css("background-image","url("+data.thumb+")");
		$(".maincard .title-block .thumb").css("background-image","url("+data.thumb+")");


		$(".player .player-title .channel").html(data.name.split("-")[0]);
		$(".maincard #channel").html(data.name.split("-")[0]);


		$(".player .player-title .title").html(data.name.split("-")[1]);
		$(".maincard #title").html(data.name.split("-")[1]);
	}

	function playSong(id){
			playing = true;


			fetchRelated(id);
			$("#playpause").removeClass("fa-play").addClass("fa-pause");
			$("audio").attr("src","/download/"+id+".mp3");
			$("audio")[0].play();

	}


	function updateSeek(percent){
		if(!dragging){
			$(".seek-button").css("transform","translateX("+percent+"px)")
		}
	}


	$(".top-seek").on("click",function(e){

		var clickPercent = e.clientX/e.currentTarget.getBoundingClientRect().width;
		console.log(clickPercent)
		updateSeek(e.clientX);
		this.audioEl.currentTime = clickPercent*this.audioEl.duration;

	}.bind(this))

	 this.audioEl.addEventListener('timeupdate', function(e) {
	 	updateSeek((e.srcElement.currentTime/e.srcElement.duration)* ($(".seek-holder").width()) )

	 });


	 this.audioEl.addEventListener('progress', function(e) {
    	var bufferedEnd = e.srcElement.buffered.end(e.srcElement.buffered.length - 1);
    	var duration =  e.srcElement.duration;
	    if (duration > 0) {
	      $(".loaded").css("width", ((bufferedEnd / duration)*100) + "%");
	    }
	});


}

var player = new Player();


function initializeCollection(){
	$.ajax({
		url:"/api/getUserCollection/110862037522019880955",
		success:function(data){
			for (var i = 0; i < data.length; i++) {
				var temp = $($("#cardTemplate").html())
				temp.find(".thumb").css("background-image","url("+data[i].thumb+")");
				temp.find(".title").html(data[i].name.split("-")[0])
				temp.find(".channel").html(data[i].name.split("-")[1])
				bindContextMenuClick(data[i],temp,[])
				bindCardClick(data[i],temp)
				$("#myCollection").append(temp)
			};
		}
	})
}

function bindCardClick(data,$dom){
	$dom.on("click",function(e){
		console.log(data);
		if($(".context-menu").hasClass("open")){
			return;
		}
		player.play(data)
	})
}

function bindContextMenuClick(data,$dom,menuitems){
	$dom.find(".context-menu-button").on("click",function(e){

		$(".context-menu").html("");
		for (var i = 0; i < menuitems.length; i++) {
			var tempDom = $('<div class="menu-item">'+menuitems[i].title+'</div>');
			tempDom.on('click',(function(x){ return function(){x.callback(data)}; }  )(menuitems[i]) );
			$(".context-menu").append(tempDom);
		};
		
		if($(".context-menu").hasClass("open")){
			$(".context-menu").removeClass("open")
			return;
		}

		var yOffset = $(e.target).parent().offset().top;
		var xOffset = e.target.parentElement.getBoundingClientRect().width;


		$(".context-menu").css("left",(xOffset-116)+"px").css("top",(yOffset)+"px");
		openContextMenu(e);
	})

}



$('body').on("touchmove",function(e){
	if($(e.target).hasClass("context-menu") || $(e.target).parent().hasClass("context-menu")){

	}else{
	  $(".context-menu").removeClass("open");
	}

});

function openContextMenu(e){
	$(".context-menu").addClass("open");
	e.stopPropagation();


}

function hideOverlay(){
	$(".input-box").removeClass("expand");
	$(".search-overlay").removeClass("show");
	$(".search-icon-el").addClass("fa-search").removeClass("fa-arrow-left");
	$(".clear-btn-el").hide();
}



	function initilizeDownload(id,cb){

		$.ajax({
			url:"/api/initializeDownload/"+id,
			type:"POST",
			success:function(data){
				console.log(data);
				cb();
			}
		})

	}


		function fetchRelated(videoId){
		$(".related").html("");
		$.ajax({
			url:"/related/"+videoId,
			success:function(data){
					var data = JSON.parse(data);
					for (var i = 0; i < data.items.length; i++) {

						var name = data.items[i].snippet.title;
						var id = data.items[i].id.videoId;
						var template = $("#relatedCardItem").html();

						var $template = $(template);
						$(".related").append($template);
						
						$template.attr("id","track"+id)

						$template.find("#title").html(name.split("-")[0])
						$template.find("#channel").html(name.split("-")[1])
						$template.find(".thumb")[0].style.backgroundImage = "url(https://i.ytimg.com/vi/"+id+"/mqdefault.jpg)";

						$template.on("click",relatedItemClickListener);

	
				};
			}
		})
	}


	function relatedItemClickListener(e){

		var id = $(e.currentTarget).attr("id").split("track")[1];
		console.log(id)
		fetchDetails(id)

	}


		function fetchDetails(idParam){


		


		var id = idParam;

		$.ajax({
			url:"/api/video/"+id,
			success:function(data){
				var data = JSON.parse(data).items[0];
				fetchRelated(id);

				var playerData = {
						"id":data.id,
						"name":data.snippet.title,
						"thumb":data.snippet.thumbnails.default.url,
						"uri":"http://bamusiclocal.com/download/"+data.id+".mp3"
					};
						player.play(playerData)
			

				
			}
		})
	}




/*$(".input-el").on("blur",function(){
	
});*/