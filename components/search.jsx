import React from 'react';
import Song from './searchItemSong.jsx'

class Search extends React.Component {
	constructor(props){
		super(props)

		this.state = {
			showResults : false,
			searchResults:[]
		}
	}
	search(e){


	}
	componentDidMount(){
		var that = this;
		var searchHandler = function() {
				that.props.search(that.refs.input.value)
		};

		this.refs.input.onkeyup = searchHandler;

	}
	focusInput(){

		this.setState({showResults:true},function(){
			this.refs.input.focus();
		}.bind(this))
	}
	blurInput(e){
		this.setState({showResults:false})
		this.props.search("")
		this.refs.input.value = ""
		this.refs.input.blur();
	}
	render(){

		var expandSearchbar = this.state.showResults?"expand":"";
		return(
		<div className="header">
			
			<span className="main-title">bamusic</span>
			<span className={"icon-search"} onClick={this.focusInput.bind(this)} ></span>
			<div className={"searchHolder "+expandSearchbar}>
				<span className={"icon-arrow-left"} onClick={this.blurInput.bind(this)} ></span>
				<input ref={"input"}  onFocus={this.focusInput.bind(this)} placeholder="Search" />
			</div>
		</div>);
	}
}

export default Search;

