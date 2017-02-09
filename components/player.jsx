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
					
			})
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