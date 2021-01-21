import React, { Component } from 'react';
import './styles.css'

class SelectedObjectIconPanel extends Component{
    constructor(props) {
        super(props);
      }
    render() {
        return (
            <div className = "icon_panel left">
            <div className = "top">
                <button className="icon">
                <i className={"fa " + this.props.icon} ></i>
                </button>
            </div>
            <div className = "bottom">
            
            </div>
            </div>
        );
    }
}
  
  export default SelectedObjectIconPanel;











        