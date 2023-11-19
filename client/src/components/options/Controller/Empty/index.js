import React, {Component} from 'react';

import Header from '../../header/index';
import Footer from '../../footer/index';

class EmptyController extends Component{

    constructor(props) {
        super(props);
    }

    render() {
        const header = <Header engaged={false} leftIcon="logo" />;
        const footer = <Footer onUpdate={this.props.footer.onUpdate} selectedValue={this.props.footer.selectedValue} />;

        return <>
            <div class="top-controls">
                {header}
            </div>
            <div class="bottom-controls">
                {footer}
            </div>
        </>
    }
}

export default EmptyController;
