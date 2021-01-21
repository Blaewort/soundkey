import React, { Component } from 'react';
import './styles.css'

class SelectedObjectLabelPanel extends Component {

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
                {this.props.subLabel}
                </span>
            </div>
            </div>

        );
  }
}
  
export default SelectedObjectLabelPanel;





