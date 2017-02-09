import React from 'react';

class ContextMenu extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            open:false,
            data:{}
            }
    }
    
    componentDidMount(){
        var that = this;
		//this.updateState();

		this.props.store.subscribe(function(){
		      that.setState({
		      open:that.props.store.getState().open,
		      data:that.props.store.getState().data
		      });
		})

    }

    componentWillReceiveProps(props){
        console.log(props)

    }

    menuClick(e,a){
    	e.stopPropagation();
    	//e.stopImmediatePropagation();
    	this.props.deleteTrack(this.state.data.id);
    }
    menuClickBlank(e){
    	e.stopPropagation();
    }
    hideThis(e){
        e.stopPropagation();
        this.props.store.dispatch({ type: 'CLOSE' });
        
    }
    render(){
    	console.log( this.state.data)
        var hide = this.state.open?"expand":"";
        return(<div onClick={this.hideThis.bind(this)} className={"contextMenuWrap "+hide }>
            
            <div className="contextMenuContent">
				<div className="songDetails">
					<div className="fl thumbnail">
						<img src={this.state.data.thumb} />
					</div>
					<div className="fl details"> 
							<div className="name">{this.state.data.name}</div>
							<div className="artist">{this.state.data.name}</div>
					</div>
				</div>
				<div className="menu-item-wrap">
					<a href={this.state.data.uri+"?filename="+this.state.data.name} download><div onClick={this.menuClick.bind(this)} className="menu-item"> Download <span className="menu-icon icon-download"> </span> </div></a>
					<a href={"whatsapp://send?text=Checkout *"+ this.state.data.name +"* on bamusic https://bamusic.in/track/"+this.state.data.id} >
			    		<div onClick={this.menuClickBlank.bind(this)} className="menu-item"> Share <span className="menu-icon  icon-whatsapp"> </span> </div>
					</a>
					
					<div onClick={this.menuClick.bind(this)} className="menu-item"> Remove from Collection <span className="menu-icon  icon-trash-o"> </span> </div>
				</div>
            </div>
        </div>);
    }

}



export default ContextMenu;