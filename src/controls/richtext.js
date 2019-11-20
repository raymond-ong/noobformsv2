import React from 'react';
import './common.css';
import './richtext.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import noobControlHoc from '../hoc/noobControlsHoc';

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

const toolbarConfig = {
    inline: {
      visible: true,
      inDropdown: false,
      bold: { visible: false},
      italic: { visible: true, icon: 'xxx.png', },
      underline: { visible: true, icon: 'xxx.png', },
      strikeThrough: { visible: true, icon: 'xxx.png', },
      monospace: { visible: true, icon: 'xxx.png', }
    },
    blockType: { visible: true, },
    fontSize: { visible: true, icon: 'xxx.png', },
    fontFamily: { visible: true, },
    list: {
      visible: true,
      inDropdown: true,
      unordered: { visible: true, icon: 'xxx.png', },
      ordered: { visible: true, icon: 'xxx.png', },
      indent: { visible: true, icon: 'xxx.png', },
      outdent: { visible: true, icon: 'xxx.png', }
    },
    textAlign: {
      visible: true,
      inDropdown: true,
      left: { visible: true, icon: 'xxx.png', },
      center: { visible: true, icon: 'xxx.png', },
      right: { visible: true, icon: 'xxx.png', },
      justify: { visible: true, icon: 'xxx.png', }
    },
    colorPicker: { visible: true, icon: 'xxx.png', },
    link: {
      visible: true,
      inDropdown: true,
      addLink: { visible: true, icon: 'xxx.png', },
      removeLink: { visible: true, icon: 'xxx.png', },
    },
    image: { 
      visible: true, 
      icon: 'xxx.png',
      fileUpload: true,
      url: true,
    },
    history: {
      visible: true,
      inDropdown: true,
      undo: { visible: true, icon: 'xxx.png', },
      redo: { visible: true, icon: 'xxx.png', },
    }
  }

const RichText = (props) => {
    console.log('rich text render', props.data.label);
    let wrapperClassNames = 'wrapper';
    if (props.selected === true) {
        wrapperClassNames += ' selected'
    }

    //https://github.com/jpuri/react-draft-wysiwyg/issues/4
    return <div className={wrapperClassNames}>
        <div className="label">{props.data.label}</div>
        <Editor
            wrapperClassName="editorWrapper"
            toolbar={toolbarConfig}
        />
    </div>
}

export default noobControlHoc(RichText);