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

        if(!this.props.list || !Array.isArray(this.props.list)) { //was this.props.list === undefined
            console.log("Invalid Object, Expected object with map function, received: ",this.props.list );
            list = TEMP_ITEMS;
        } else {
            list = this.props.list;
        }

        console.log("list");
        console.log(list);

        //TODO: this is a modal list should seperate list from list with modal capabilities in low-height 

        //how do I know if there is only room for one item (low-height resolution) so I can make one item or the first item click to open the modal???
        
        
        

        const listItems = list.map((item) => {
            // we have a bad data issue at the moment where some names arent working so some chords have duplicate name erroneous, which creates a duplicate key issue
            // so make a random number and tack it on top to fix it
            const randomNumber = Math.floor(Math.random() * 10000);
            const randomString = randomNumber.toString();
            
            return <li key={item.label+randomString} onClick={(e) => this.props.handleItemClick(e,item)}>{item.label}</li>
        });

        //make the list modal
        const listModalItems = [...listItems];
        console.log("listModalItems");
        console.log(listModalItems);

        //I add a list element to the very beginning of listItems and give it a class that is invisible
        listItems.unshift (<li key="Choose..." onClick={this.props.modal.open} className="listModalButton"><i class="fa fa-bars" aria-hidden="true"></i>  View List</li>);

        const modalClassName = this.props.modal.on ? "listModal engaged" : "listModal";

        /* if firefox starts supporting the :has css selector we can not have the top line conditional and just use :has to select based on children class */
        return (
            <div className={this.props.modal.on ? "list_area modal_engaged" :"list_area"}>
                <span className="list_title">
                    {this.props.title || TEMP_TITLE}
                </span>
                <ul className="list">
                    <div className="option_container">
                        {listItems}
                    </div>
                </ul>
                <ul class={modalClassName}>
                    <span>{this.props.title || TEMP_TITLE}</span>
                    <button className="modalButton" onClick={this.props.modal.onExitClick}><i class="fa fa-times" aria-hidden="true"></i></button>
                    <div className="modal_option_container">
                        {listModalItems}
                    </div>
                </ul>
            </div>
        );
    }
  }
  
  export default ListArea;