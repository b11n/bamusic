import React from 'react';


class Song extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			store:props.store,
			menustore:props.menustore,
			playing:false
		}
		
	}
	playthis(){
	    this.props.play(this.props.data)
	}
	componentDidMount(){
		var that = this;
		
		this.state.store.subscribe(function(){

			var globalStore = that.state.store.getState();

			if(globalStore.state == "PLAY" && globalStore.id == that.props.data.id ){
			
					that.setState({playing:true})
			
			}else{
				
				that.setState({playing:false})
			}

		})
	}
	removeThis(e){

		this.props.deleteTrack(this.props.data)
		e.stopPropagation()
	}
	openMenu(e){
		 e.stopPropagation();
		  this.state.menustore.dispatch({ type: 'OPEN' ,data:this.props.data});
		 
	}
	render(){

	    if(this.props.data.name.split("-").length > 1){
	        	 var name = this.props.data.name.split("-")[1];
                 var artist = this.props.data.name.split("-")[0];
	    }else{
	        artist  = name = this.props.data.name
	    }

	    var playing = this.state.playing?"":"hide";



	    const divStyle = {
            backgroundImage: 'url(' + this.props.data.thumb + ')',
        };
		return(<li onClick={this.playthis.bind(this)} className="card" key={this.props.data.id}>
		<div className="thumb fl" style={divStyle} >
			<img className={"playing "+playing} src="/public/images/audio.svg"></img>
		</div>
		<div className="details fl">
                		<div className="name"> {name} </div>
                		<div className="artist"> {artist} </div>
		</div>
		<div className="icons fl">
		    <span onClick={this.openMenu.bind(this)} className="icon-ellipsis-v"></span>

           
            
		</div>


		</li>);
	}
}

export default Song;


