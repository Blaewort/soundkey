import React, { Component } from 'react';
import './styles.css'

import HeaderIconPanel from './iconPanel';
import HeaderSearchPanel from './searchPanel';

class Header extends Component {

  constructor(props) {
    super(props);
  }

    render () {
      return (
          <div className={"visual_header " + (this.props.engaged ? "engaged " : " ") + (this.props.userText ? "user_text " : " ")}>
              <HeaderIconPanel icon={this.props.leftIcon}></HeaderIconPanel>
              <HeaderSearchPanel placeholder={this.props.placeholder}></HeaderSearchPanel>
              <HeaderIconPanel icon={this.props.rightIcon}></HeaderIconPanel>
          </div>
      );
  }
}

  export default Header;