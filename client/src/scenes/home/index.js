import React from 'react';
import Sidebar from '../../components/sidebar/index'
import Content from '../../components/content/index'


import ChordTypeRadio from '../../components/options/content/radio/ChordType.js'
import Toggle from '../../components/options/content/toggle/index'


import ListArea from '../../components/options/content/listArea/index.js'
import NoteNav from '../../components/options/content/noteNav/index.js'

import Header from '../../components/options/header/index.js'
import SelectedObject from '../../components/options/content/selectedObject/index.js'

function Home() {
    

    return (
        <div>
            <Sidebar />
            <Content>
                <h1>Home Page!</h1>

                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pellentesque laoreet faucibus. Donec at velit ut libero bibendum rhoncus. Maecenas interdum dolor nisi, at consectetur metus feugiat quis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu auctor lectus. Suspendisse rutrum nec massa ut aliquam. Phasellus sit amet turpis vehicula, congue enim in, posuere sapien. Curabitur neque sem, feugiat nec lacus vel, feugiat vehicula mi.

    Morbi consectetur vitae augue et fringilla. Nam dapibus ligula non lectus efficitur, non bibendum neque porta. Etiam pretium nisi eget arcu bibendum rutrum. Morbi interdum vel quam pulvinar feugiat. Aliquam bibendum tellus metus, eget luctus sem pharetra sit amet. Curabitur placerat rutrum placerat. Integer posuere metus vel hendrerit rhoncus. Vivamus lacinia non arcu non convallis.

    Fusce et elit tristique, suscipit leo fringilla, rutrum odio. In hac habitasse platea dictumst. Nulla facilisi. In id ex malesuada augue dignissim fermentum. Mauris vulputate mauris id elit accumsan auctor. Curabitur ullamcorper dictum tempus. Vestibulum non mauris quis ex porta luctus eu nec risus. Ut efficitur urna quis massa semper convallis. Nunc laoreet, dui ac fermentum faucibus, diam diam molestie mi, non finibus lectus nibh semper mauris. Nulla facilisi. Aliquam aliquam vulputate ipsum, vitae aliquet urna fermentum sit amet. Phasellus sit amet fermentum mi.

    Cras mollis porttitor scelerisque. Aliquam auctor, lacus a fermentum varius, velit dolor pellentesque sapien, vitae posuere nibh leo eget mi. Nam lobortis, arcu vitae bibendum dictum, neque lorem pharetra ante, eget sollicitudin leo est quis leo. Etiam in sodales ligula, eget suscipit sem. Nunc nec sem elit. Donec porta, ligula non feugiat suscipit, lacus dui convallis massa, sit amet ullamcorper ligula orci a tortor. Sed felis magna, gravida nec aliquet id, condimentum sed orci. Phasellus interdum fringilla enim vitae ultrices.

    Aliquam ornare dignissim viverra. Sed a erat hendrerit, fringilla nulla sed, aliquam dui. Etiam pulvinar lectus ac lorem consequat sodales. Aliquam elementum nisi risus, rhoncus dapibus mi consectetur et. Proin eu lorem nibh. Etiam id tempus turpis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur sit amet mauris bibendum sapien luctus dictum. Nulla urna neque, scelerisque a lobortis a, iaculis ut neque.

            <Header engaged={true} userText={true} leftIcon="logo" rightIcon="keyboard" placeholder=""/>
            <SelectedObject label="Bm" subLabel="i"/>
            </Content>
        </div>
    );
  }
  
  export default Home;
  