import React from 'react';
import './styles.css'

class Radio extends Component {
    render() {
        return (
            <div className="radio">
                <span>
                    Notes
                </span>
                <div class="radio_options"> 
                <div class="radio_option">5</div>
                <div class="radio_option">6</div>
                <div class="radio_option selected">7</div>
                <div class="radio_option">8</div>
                <div class="radio_option">12</div>
            </div>
        </div>
        );
    }
}
  
  export default Radio;



          