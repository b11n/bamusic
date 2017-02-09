import React from 'react';
import reqwest from 'reqwest';

class Song extends React.Component {
	constructor(props){
		super(props);
		
	}
	addToCollection(){
	   
	    var payload = {
	        name:this.props.data.name,
	        thumb:this.props.data.thumb,
	        videoid:this.props.data.id
	    };
        var that = this;
	    reqwest({
			url: '/api/collection'
		  , method: 'post'
		  , data:payload
		  , success: function (resp) {
		  		that.props.add(resp)
		  	}
		})
	}
	render(){

	    const divStyle = {
            backgroundImage: 'url(' + this.props.data.thumb + ')',
        };
		return(<li className="card" key={this.props.data.id}>
		<div className="thumb fl" style={divStyle} >
		</div>
		<div className="details fl">
                		<div className="name"> {this.props.data.name.split("-")[1]} </div>
                		<div className="artist"> {this.props.data.name.split("-")[0]} </div>
		</div>

		<div className="icons fl">
            <span className="icon icon-plus" onClick={this.addToCollection.bind(this)}></span>
            <span className="icon icon-download hide"></span>
		</div>


		</li>);
	}
}

export default Song;