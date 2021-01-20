import React from 'react';
import './styles.css'

import optHeaderIconPanel from './iconPanel';
import optHeaderSearchPanel from './searchPanel';

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






