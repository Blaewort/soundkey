import React from 'react';
import './styles.css'

import optHeaderIconPanel from './iconPanel/index';
import optHeaderSearchPanel from './searchPanel/index';

class OptHeader extends Component {
    render () {
      return (
          <div className="visual_header">
              <optHeaderIconPanel></optHeaderIconPanel>
              <optHeaderSearchPanel></optHeaderSearchPanel>
              <optHeaderIconPanel></optHeaderIconPanel>
          </div>
      );
  }
}
  
  export default OptHeader;






