import React from 'react';
import Song from './searchItemSong.jsx'
class SearchResult extends React.Component {
	constructor(props){
		super(props);

	}
	render(){
	    
	    var songs = [];

	    var hide = this.props.songData.length>0?"":"hide"

	    for(let i = 0 ; i < this.props.songData.length;i++){
	        var temp =
	        songs.push(<Song key={this.props.songData[i].id} add={this.props.add} data={this.props.songData[i]} />)
	    }
		return (<div className="search-result-wrap">
		  <div className={"youtube-results-header "+hide}>
		      <span className="icon-youtube-play"></span> 
		      Youtube Results
		  </div>
		  <ul className="songList">{songs}</ul>
		</div>
		);
	}
}

export default SearchResult;