import React, { Component } from 'react';
import './styles.css'

class Toggle extends Component{


    constructor(props) {
        super(props);
        //ARG: props.title is the title
        //ARG (optional): props.checked true/false. Default is off

        this.state = {
            checked: Boolean(this.props.checked),
        };
    }

    handleChange(event) {
        this.setState((state, props) => ({
            checked: !state.checked,
        }));
      }


    render() {
        const input = this.state.checked ? <input className="custom_checkbox" type="checkbox" checked /> : <input className="custom_checkbox" type="checkbox" />;

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



  
     
