import React, { Component } from 'react';

class HeaderIconPanel extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        const logo = this.props.icon === "logo";
        let icon;

        switch(this.props.icon) {
            case "logo":
                icon = <i className="fas fa-music"></i>
                break;
            case "stream":
                icon = <i className="fas fa-stream"></i>
                break;
            case "search":
                icon = <i className="fas fa-search"></i>
                break;
            case "check":
                icon = <i className="fas fa-check"></i>
                break;
            case "x":
                icon = <i className="fas fa-times"></i>
                break;
            case "keyboard":
                icon = <i className="fas fa-keyboard"></i>
                break;
        }

        let element;
        if (icon) {
            element = <button className={"icon" + (logo ? " logo" : "")}  >
                {icon}
            </button>

        }

        return ( 
            <div className="icon_panel">
                {element}
            </div>
        );
  }
}
  
  export default HeaderIconPanel;

