import React, { Component } from 'react';
import './styles.css'



const TEMP_ITEMS = [
    {
        label: "thing 1",
    },
    {
        label: "thing 2",
    },
    {
        label: "thing 3",
    },
    {
        label: "thing 4",
    },
    {
        label: "thing 5",
    },
    {
        label: "thing 6",
    },
    {
        label: "thing 7",
    }
];

const TEMP_TITLE = "List";

class ListArea extends Component {

    constructor(props) {
        super(props);
      }

    render () {
        let list;
        console.log("_list");
        console.log(list);
        if(this.props.list === undefined) {
            console.log("Invalid Object, Expected object with map function, received: ",this.props.list );
            list = TEMP_ITEMS;
        } else {
            list = this.props.list;
        }
        console.log(list);

        //list = TEMP_ITEMS;
        console.log("list");
        console.log(list);
        const listItems = list.map((item) => 
            <li key={item.label} onClick={(e) => this.props.handleItemClick(e,item)}>{item.label}</li>
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