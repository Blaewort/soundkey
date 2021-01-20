import React, { Component } from 'react';
import './styles.css'

class ListArea extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.HandleChange.bind(this);
        this.state = {selected: null};
      }

    HandleChange(e){
        console.log(e);
        this.setState({selected: e});
    }

    render () {
        const list = this.props.list;
        const listItems = list.map((item) => 
            <li key={item} onClick={(e) => this.handleChange({item})}>{item}</li>
        );
        return (
            <div className="list_area">
                <span>
                    {this.props.title}
                </span>
                <ul>
                    <div className="option_container">
                        {listItems}
                    </div>
                </ul>
            </div>
        );
    }
  }
  
  export default ListArea;