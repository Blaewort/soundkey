import React, { Component } from 'react';
import './styles.css'

class Header extends Component {

  constructor(props) {
    super(props);
  }

    render () {
      return (
          <div className={"visual_header " + (this.props.engaged ? "engaged " : " ") + (this.props.userText ? "user_text " : " ")}>
              <IconPanel onClick={this.props.leftIconClick} icon={this.props.leftIcon} />
              <SearchPanel placeholder={this.props.placeholder} />
              <IconPanel onClick={this.props.onRightIconClick || null} icon={this.props.rightIcon} />
          </div>
      );
  }
}

  export default Header;

  class IconPanel extends Component {
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
            element = <button onClick={this.props.onClick} className={"icon" + (logo ? " logo" : "")}  >
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

class SearchPanel extends Component {
  render() {
      return (
          <div className="search_panel">
              <div className="search_container">
                  <input type="text" placeholder={this.props.placeholder} />
              </div>
          </div>
      );
  }
}