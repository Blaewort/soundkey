import React, { Component } from 'react';
import './styles.css'

class Toggle extends Component{


    constructor(props) {
        super(props);

    }

   

    render() {
        const onClick = this.props.handleClick;
        
        const input = Boolean(this.props.checked) ? <input onClick={onClick} className="custom_checkbox" type="checkbox" checked /> : <input onClick={onClick} className="custom_checkbox" type="checkbox" />;

        return (
            <div className="toggle_container">
                <span className="label">
                    {this.props.title}
                </span>

                <div class="switch_container">
                    <label class="switch">
                        {input}
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
        );
    }
}
  
export default Toggle;



  
     
