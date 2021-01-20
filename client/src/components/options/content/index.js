import React from 'react';
import './styles.css'

import ListArea from './listArea/index';
import NoteNav from './noteNav/index';
import Radio from './radio/index';
import SelectedObject from './selectedObject/index';
import Toggle from './toggle/index';

class OptContent extends Component {
    render() {
        return (
            <div className="content">
                {/* listArea, noteNav, radio, selectedObject, toggle, etc */}
            </div>
        );
  }
}
  
  export default OptContent;
