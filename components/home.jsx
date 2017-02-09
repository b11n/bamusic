import React from 'react';
import Search from './search.jsx'
import SongList from './songList.jsx'
import SearchResult from './searchResult.jsx'
import Player from './player.jsx'
import ContextMenu from './contextMenu.jsx'



import reqwest from 'reqwest';
import { createStore } from 'redux'


function playerReducer(state = {id:"",uri:"",state:"PAUSED",contextMenu:false}, action) {
  switch (action.type) {
	  case 'PLAY':
	    return {id:action.id,uri:action.uri,state:"PLAY"}
	  case 'PAUSE':
	    return {state:"PAUSED"}
	    return state
  }
}

function menuReducer(state={open:false},action){
	  switch (action.type) {
	  case 'OPEN':
	    return {open:true,data:action.data}
	  case 'CLOSE':
	    return {open:false,data:{}}
	    return state
  	}

}


class Home extends React.Component {
	constructor(props){
		super(props);

		var _this = this;
		this.getUserCollection(function(resp){
			_this.setState({
				songData:resp,
				filtered:resp,
			})
		})
		let store = createStore(playerReducer);
		let ContextMenuStore = createStore(menuReducer);


		this.state = {
			songData:[],
			filtered:[],
			searchResults:[],
			currentTrack:{},
			query:"",
			playerStore:store,
			ContextMenuStore:ContextMenuStore
		}

		
	}

	getUserCollection(cb){
		
		reqwest({
			url: '/api/getUserCollection/auth'
		  , method: 'get'
		  , success: function (resp) {
		  		cb(resp)
		  	}
		  })

	}

	addToCollection(item){
		var _this = this;
		var temp = Object.assign([],this.state.songData);
		temp.push(item);
		this.setState({songData:temp},function(){
			_this.getfilter()
		})
	}
	search(query){
		var _this = this;
		this.setState({query:query},function(){
			_this.getfilter();
		})

	}
	getfilter(){

		var query = this.state.query;

		var newList = this.state.songData.filter(function(item){
			return item.name.toLowerCase().indexOf(query.toLowerCase())==-1?false:true;
		});
		if(query.length > 0){
			this.searchYoutube(query)
		}else{
			 this.setState({searchResults:[]})
		}
		this.setState({filtered:newList})
	}

	searchYoutube(passedvalue){
		var that = this;
		var ids = this.state.songData.map(function(item){
				return item.id;
			})

		


		
		ytsearchdebounced(passedvalue,ids,that);
	}
	
	play(data){
	/*	this.setState({
			currentTrack:data
		});*/
		//console.log(data)

		this.setMeta(data)
		this.state.playerStore.dispatch({ type: 'PLAY', uri:data.uri,id:data.id })
	}

	setMeta(data){
		if ('mediaSession' in navigator) {

		  navigator.mediaSession.metadata = new MediaMetadata({
		    title: data.name,
		    artwork: [
		      { src: data.thumb, sizes: '512x512', type: 'image/jpg' },
		    ]
		  });
		}
		}

	deleteTrack(id,b){
		var a = {id:id}
		var that = this;
		reqwest({
				url: '/api/collection/'+a.id
			  , method: 'delete'
			  , success: function (resp) {
			  	 console.log("delete success")
					var temp = Object.assign([],that.state.songData);
					temp = temp.filter(function(item){
						console.log(item.id)
						if(item.id == a.id){
							return false;
						}else{
							return true;
						}
					})

					that.setState({songData:temp})
					that.getfilter();
			  }
		 });	

	}

	render(){
		return(<div>

			<Search search={this.search.bind(this)}   ></Search>
			<SongList store={this.state.playerStore} menustore={this.state.ContextMenuStore} deleteTrack={this.deleteTrack.bind(this) } play={this.play.bind(this)} songData={this.state.filtered} ></SongList>
			<SearchResult add={this.addToCollection.bind(this)} songData={this.state.searchResults} ></SearchResult>
			<Player store={this.state.playerStore} data={this.state.currentTrack}></Player>
			<ContextMenu deleteTrack={this.deleteTrack.bind(this)} store={this.state.ContextMenuStore}></ContextMenu>
			</div>);
	}
}

export default Home;





function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function ytsearch(value,ids,that){


			reqwest({
				url: '/api/search?q='+value
			  , method: 'get'
			  , success: function (resp) {
				var tempData = [];
				var resp = JSON.parse(resp)
				  for(var i=0;i<resp.items.length;i++){
					var temp = {
						id:resp.items[i].id.videoId,
						thumb:resp.items[i].snippet.thumbnails.default.url,
						name:resp.items[i].snippet.title,
						uri:"/download/"+resp.items[i].id.videoId+".mp3"
					}

					if(ids.indexOf(temp.id) == -1){
						tempData.push(temp);
					}


				  }
				  that.setState({searchResults:tempData})
				}
			})
}


var ytsearchdebounced = debounce(ytsearch,250)