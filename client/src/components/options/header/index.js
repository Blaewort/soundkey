import React, { Component } from 'react';
import './styles.css'

import OptHeaderIconPanel from './iconPanel';
import OptHeaderSearchPanel from './searchPanel';

class OptHeader extends Component {

  constructor(props) {
    super(props);
  }

    render () {
      return (
          <div className={"visual_header " + (this.props.engaged ? "engaged " : " ") + (this.props.userText ? "user_text " : " ")}>
              <OptHeaderIconPanel icon={this.props.leftIcon}></OptHeaderIconPanel>
              <OptHeaderSearchPanel placeholder={this.props.placeholder}></OptHeaderSearchPanel>
              <OptHeaderIconPanel icon={this.props.rightIcon}></OptHeaderIconPanel>
          </div>
      );
  }
}

  export default OptHeader;