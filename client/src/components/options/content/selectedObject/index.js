import React from 'react';
import './styles.css'

import selectedObjectIconPanel from './iconPanel/index';
import selectedObjectLabelhPanel from './labelPanel/index';

class SelectedObject extends Component(props) {
    render() {
        return (
            <div className ="object_selection">
                <selectedObjectIconPanel></selectedObjectIconPanel>
                <selectedObjectLabelPanel></selectedObjectLabelPanel>
                <selectedObjectIconPanel></selectedObjectIconPanel>
            </div>
        );
    }
}
  
  export default SelectedObject;


