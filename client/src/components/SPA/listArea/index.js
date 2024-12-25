import React, { Component } from 'react';
import './styles.css'



const TEMP_ITEMS = [
    {
        label: "thing 1",
    },
];

const TEMP_TITLE = "List";

const SPINNER = <>
    <div id="loading">
        <div class="spinner"></div>
    </div>
</>;


class ListArea extends Component {

    constructor(props) {
        super(props);
      }
/* DEBUG */
      componentDidUpdate(prevProps, prevState) {
        console.log("ListArea re-rendered!");

        console.log("UPDATE LISTAREA__________________________________________!");
        Object.entries(this.props).forEach(([key, val]) =>
          prevProps[key] !== val && console.log(`Prop '${key}' changed`)
        );
        console.log(prevProps);
        console.log("VS");
        console.log(this.props);
      
        if (this.state) {
          Object.entries(this.state).forEach(([key, val]) =>
            prevState[key] !== val && console.log(`State '${key}' changed`)
          );
        }
    }

    


    /*shouldComponentUpdate(nextProps, nextState) {
        // Only re-render if props or state change that matter
        console.log("SDFSDFSDFSDFSDFSDFEEEEEEEEEEEEEEEEEEEEEEEE");
        return nextProps !== this.props;
 }*/
    

    render () {
        let list;

        console.log("_list");
        console.log(list);

        let STILL_LOADING_DATA = false;

        if(!this.props.list || !Array.isArray(this.props.list)) { //was this.props.list === undefined
            // if no list at all was passed, not even an empty one (an empty list would indicate that data fetching completed), act like we are loading (we should be)
            console.log("Invalid Object, Expected object with map function, received: ",this.props.list );
            list = TEMP_ITEMS;
            STILL_LOADING_DATA = true;
        } else {
            list = this.props.list;
        }

        console.log("list");
        console.log(list);

        //TODO: this is a modal list should seperate list from list with modal capabilities in low-height 

        //how do I know if there is only room for one item (low-height resolution) so I can make one item or the first item click to open the modal???
        
        console.log(this.props);
        console.log("this.props^");

        
        

        const listItems = list.map((item) => {
            // we have a bad data issue at the moment where some names arent working so some chords have duplicate name erroneous, which creates a duplicate key issue
            // so make a random number and tack it on top to fix it
            const randomNumber = Math.floor(Math.random() * 10000);
            const randomString = randomNumber.toString();

            const handleItemClick = this.props.handleItemClick;
            console.log("RENDERING");
            console.log(handleItemClick);
            console.log("handleItemClick^");
            
            return <li 
            style={STILL_LOADING_DATA ? { opacity: 0 } : { opacity: 1 }} // if STILL_LOADING_DATA gonna be a 1-item list just to pad out space
            key={item.label+randomString} 
            onClick={(e) => {return handleItemClick(e,item);}}>
                {item.label}
            </li>
        });

        console.log(listItems);
        console.log("listItems^");

        //make the list modal
        const listModalItems = [...listItems];


        //I add a list element to the very beginning of listItems and give it a class that is invisible
        listItems.unshift (<li key="Choose..." onClick={this.props.modal.open} className="listModalButton"><i class="fa fa-bars" aria-hidden="true"></i>  View List</li>);

        const modalClassName = this.props.modal.on ? "listModal engaged" : "listModal";

        console.log("Rendering ListArea");

        /* if firefox starts supporting the :has css selector we can not have the top line conditional and just use :has to select based on children class */
        return (
            <div className={this.props.modal.on ? "list_area modal_engaged" :"list_area"}>
                <span className="list_title">
                    {this.props.title || TEMP_TITLE}
                </span>
                <ul className="list">
                    <div className="option_container">
                        {listItems}
                        {STILL_LOADING_DATA ? SPINNER: null}
                    </div>
                </ul>
                <ul class={modalClassName}>
                    <span>{this.props.title || TEMP_TITLE}</span>
                    <button className="modalButton" onClick={this.props.modal.onExitClick}><i class="fa fa-times" aria-hidden="true"></i></button>
                    <div className="modal_option_container">
                        {STILL_LOADING_DATA ? SPINNER: null}
                        {listModalItems}
                    </div>
                </ul>
            </div>
        );
    }
  }
  
  export default ListArea;