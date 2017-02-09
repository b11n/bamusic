import React from 'react';
import reqwest from 'reqwest';


class Player extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			playerState:"PAUSED",
		    uri : "",
		    id:"",
		    store:props.store
		}

	}
	updateState(){
		var that = this;
		var playerState = this.state.store.getState();
		if(playerState.state == "PLAY"){
			this.setState({
				playerState:playerState.state ,
				uri:playerState.uri,
				id:playerState.id
			},function(){
					
					that.refs.realplayer.play();
					//Call the media session API
					that.setMeta();
			})
		}
	}

	setMeta(){
		if ('mediaSession' in navigator) {

		  navigator.mediaSession.metadata = new MediaMetadata({
		    title: 'Never Gonna Give You Up',
		    artist: 'Rick Astley',
		    album: 'Whenever You Need Somebody',
		    artwork: [
		      { src: 'https://dummyimage.com/96x96',   sizes: '96x96',   type: 'image/png' },
		      { src: 'https://dummyimage.com/128x128', sizes: '128x128', type: 'image/png' },
		      { src: 'https://dummyimage.com/192x192', sizes: '192x192', type: 'image/png' },
		      { src: 'https://dummyimage.com/256x256', sizes: '256x256', type: 'image/png' },
		      { src: 'https://dummyimage.com/384x384', sizes: '384x384', type: 'image/png' },
		      { src: 'https://dummyimage.com/512x512', sizes: '512x512', type: 'image/png' },
		    ]
		  });
		}
		}
	componentDidMount(){
		var that = this;
		//this.updateState();

		this.state.store.subscribe(function(){
			that.updateState();
		})

		


		this.refs.realplayer.onended = function(e){
			that.state.store.dispatch({ type: 'PAUSE' })
		}
	   
	    this.refs.realplayer.onerror = function(e){
	        
		if(that.state.playerState == "PLAY"){
              reqwest({
                url: '/api/initializeDownload/'+that.state.id
              , method: 'post'
              , success: function (resp) {
              		console.log(resp)
              		setTimeout(function(){
              			that.refs.realplayer.src = that.state.uri;
              			that.refs.realplayer.play();
              		},500)
                   
                }
              })
		}
	        
	    }
	}
	componentWillReceiveProps(newProps){

	}
	render(){
        return(<div>
            <audio ref={"realplayer"} controls src={this.state.uri} />
        </div>)
	}
}

export default Player;