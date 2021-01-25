import React, { Component } from 'react';

class HeaderSearchPanel extends Component {
    render() {
        return (
            <div className="search_panel">
                <div className="search_container">
                    <input type="text" placeholder={this.props.placeholder} />
                </div>
            </div>
        );
  }
}
  
  export default HeaderSearchPanel;