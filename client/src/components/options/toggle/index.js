import React, { Component } from 'react';
import './styles.css'

class Toggle extends Component{


    constructor(props) {
        super(props);

    }

   

    render() {
        const onClick = this.props.handleClick;
    
       

        return (
            <div className="toggle_container">
                <span className="label">
                    {this.props.title}
                </span>

                <div className="switch_container">
                    <label className="switch">
                    <input onClick={onClick} className="custom_checkbox" type="checkbox" checked={this.props.checked} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        );
    }
}
  
export default Toggle;



  
     
