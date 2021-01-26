import React, { Component } from 'react';
import './styles.css'


const TEMP_ITEMS = [
    "thing",
    "thing2",
    "thing3",
    "thing4",
    "thing5",
    "thing6",
    "thing7"
];

const TEMP_TITLE = "List";

class ListArea extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.HandleChange.bind(this);
        this.state = {selected: null};
      }

    HandleChange(e){
        this.setState({selected: e});
    }

    render () {
        const list = this.props.list || TEMP_ITEMS;
        const listItems = list.map((item) => 
            <li key={item} onClick={(e) => this.handleChange({item})}>{item}</li>
        );
        return (
            <div className="list_area">
                <span>
                    {this.props.title || TEMP_TITLE}
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