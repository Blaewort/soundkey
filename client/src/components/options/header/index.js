import React, { Component } from 'react';
import './styles.css'

function Header(props){


      return (
          <div className={"visual_header " + (props.engaged ? "engaged " : " ") + (props.userText ? "user_text " : " ")}>
              <IconPanel onClick={props.leftIconClick} icon={props.leftIcon} />
              <SearchPanel value={props.textValue} onKeyUp={props.onTextEnterKeyUp} onTextChange={props.onTextChange} placeholder={props.placeholder} />
              <IconPanel isAValidatorOfText={props.isAValidatorOfText} userText={props.userText} textValidator={props.textValidator} onClick={props.onRightIconClick || null} icon={props.rightIcon} />
          </div>
      );
}

  export default Header;

function IconPanel(props) {
        const logo = props.icon === "logo";
        let icon;

        switch(props.icon) {
            case "logo":
                icon = <i className="fas fa-music"></i>
                break;
            case "stream":
                icon = <i className="fas fa-stream"></i>
                break;
            case "search":
                icon = <i className="fas fa-search"></i>
                break;
            case "check":
                icon = <i className="fas fa-check"></i>
                break;
            case "x":
                icon = <i className="fas fa-times"></i>
                break;
            case "keyboard":
                icon = <i className="fas fa-keyboard"></i>
                break;
        }

        let element;

        const textValidator = props.textValidator;
        

        if (icon) {
            element = <button onClick={props.onClick} className={"icon" + (logo || textValidator || (props.userText && !props.isAValidatorOfText)? " logo" : "")}  >
                {icon}
            </button>

        }

        return ( 
            <div className="icon_panel">
                {element}
            </div>
        );
  }

function SearchPanel(props){
    let ITEM_VALUE;
      return (
          <div className="search_panel">
              <div className="search_container">
                  <input value={props.value} ref={(component)=>{ITEM_VALUE = component}} onKeyUp={props.onKeyUp} onKeyUp={ props.onKeyUp ? (e) => props.onKeyUp(e,ITEM_VALUE) : null } onInput={props.onTextChange} type="text" placeholder={props.placeholder} />
              </div>
          </div>
      );
    }
