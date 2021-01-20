import React from 'react';
import './styles.css'

class Toggle extends Component{
    render() {
    return (
        <div className="toggle_container">
            <span className="label">
                Match Scale
            </span>

            <div class="switch_container">
                <label class="switch">
                    <input className="custom_checkbox" type="checkbox" />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    );
  }
}
  
export default Toggle;



  
     
