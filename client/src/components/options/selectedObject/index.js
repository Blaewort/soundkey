import React, { Component } from 'react';
import './styles.css'

import SelectedObjectIconPanel from './iconPanel';
import SelectedObjectLabelPanel from './labelPanel';

class SelectedObject extends Component {

    constructor(props) {
        super(props);
      }

    render() {
        return (
            <div className ="object_selection">
                <SelectedObjectIconPanel icon="fa-times"></SelectedObjectIconPanel>
                <SelectedObjectLabelPanel label ={this.props.label} subLabel={this.props.subLabel}></SelectedObjectLabelPanel>
                <SelectedObjectIconPanel icon="fa-wrench"></SelectedObjectIconPanel>
            </div>
        );
    }
}
  
  export default SelectedObject;