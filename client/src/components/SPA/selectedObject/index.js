import React, { Component } from 'react';
import './styles.css'



class SelectedObject extends Component {

    constructor(props) {
        super(props);
      }

    render() {
        return (
            <div className ="object_selection">
                <IconPanel onClick={this.props.onDeselect} icon="fa-times" />
                <LabelPanel label ={this.props.label} subLabel={this.props.subLabel} />
                <IconPanel onClick={this.props.onEditRequest} icon="fa-wrench" />
            </div>
        );
    }
}
  
  export default SelectedObject;

  class IconPanel extends Component{
    constructor(props) {
        super(props);
      }
    render() {
        return (
            <div className = "icon_panel left">
            <div className = "top">
                <button onClick={this.props.onClick} className="icon">
                <i className={"fa " + this.props.icon} ></i>
                </button>
            </div>
            <div className = "bottom">
            
            </div>
            </div>
        );
    }
}

class LabelPanel extends Component {

    constructor(props) {
        super(props);
      }

    render() {
        return (
            <div className= "label_panel">
            <div className ="title_container">
                <span className="title">
                    {this.props.label}
                </span>
                <span className="roman">
                {this.props.subLabel || null}
                </span>
            </div>
            </div>

        );
  }
}