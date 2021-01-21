import React, { Component } from 'react';

class OptHeaderIconPanel extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        let logo;
        if(this.props.icon === null){
            logo = <button className="icon logo">
                   </button>;
        } else if (this.props.icon === "logo"){
            logo = <button className="icon logo">
                <i className="fas fa-music"></i>
            </button>;
        } else if (this.props.icon === "stream"){
            logo = <button className="icon logo">
                <i className="fas fa-stream"></i>
            </button>;
        } else if (this.props.icon === "search"){
            logo = <button className="icon logo">
                <i className="fas fa-search"></i>
            </button>;
        } else if (this.props.icon === "check"){
            logo = <button className="icon logo">
                <i className="fas fa-check"></i>
            </button>;
        } else if (this.props.icon === "check"){
            logo = <button className="icon logo">
                <i className="fas fa-check"></i>
            </button>;
        } else if (this.props.icon === "x"){
            logo = <button className="icon logo">
                <i className="fas fa-times"></i>
            </button>;
        } else if (this.props.icon === "keyboard"){
            logo = <button className="icon logo">
                <i className="fas fa-keyboard"></i>
            </button>;
        }
        return ( 
            <div className="icon_panel">
                {logo}
            </div>
        );
  }
}
  
  export default OptHeaderIconPanel;

