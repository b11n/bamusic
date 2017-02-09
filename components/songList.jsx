import React from 'react';
import Song from './song.jsx'
class SongList extends React.Component {
	constructor(props){
		super(props);

	}
	render(){
	    
	    var songs = [];

	    for(let i = this.props.songData.length-1 ; i >= 0 ;i--){
	        var temp =
	        songs.push(<Song menustore={this.props.menustore}  store={this.props.store} key={this.props.songData[i].id} deleteTrack={this.props.deleteTrack} play={this.props.play} data={this.props.songData[i]} />)
	    }

	    var hide =  this.props.songData.length>0?"":"hide"
		return (<div className="my-collection-wrap" >

		  <div className={"my-collection "+hide}>
		      <span className="icon-headphones"></span> 
		      My Collection
		  </div>
		  <ul className="songList">{songs}</ul>
		</div>);
	}
}

export default SongList;