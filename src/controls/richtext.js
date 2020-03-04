import React from 'react';
import './common.css';
//import './richtext.css';
import 'draft-js/dist/Draft.css';
import { stateFromHTML } from 'draft-js-import-html'


import noobControlHoc from '../hoc/noobControlsHoc';

import { Editor, EditorState, RichUtils, ContentState, convertFromRaw } from 'draft-js';

const styleMap = {
    CODE: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  function getBlockStyle(block) {
    switch (block.getType()) {
      case 'blockquote': return 'RichEditor-blockquote';
      default: return null;
    }
  }

// This is now just a Read-only component.
// Let the user modify the contents at the Properties Panel area
class RichText extends React.Component {
    constructor(props) {
        super(props);
        //this.state = {editorState: EditorState.createEmpty()};
        //this.state = {editorState: EditorState.createWithContent(ContentState.createFromText('Hello'))};
        //let html = '<div><h5>I am an H5 Tag</h5><h4>I am an H4 Tag</h4><p><a href="www.google.com">www.google.com</a></p></div>';
        //let html = '<p>First sentence</p><p>Second sentence</p><a href="www.google.com">www.google.com</a></p>';
        // let html = '<table><thead><tr><td><b><i>Hello</i></b></td><td>World</td></tr></thead></table>';
        // let options = {
        //   entityStyleFn: entity => {
        //     const entityType = entity.get('type').toLowerCase();
        //     if (entityType === 'link') {
        //       const data = entity.getData();
        //       return {
        //         element: 'a',
        //         attributes: {
        //           target: data.targetOption,
        //           href: data.url
        //         }
        //       };
        //     }
        //   }
        // }
        // this.state = {editorState: EditorState.createWithContent(stateFromHTML(html, options))};
        let initialState;
        debugger
        if (props.data.richTextData) {
            initialState = EditorState.createWithContent(convertFromRaw(props.data.richTextData));
        }
        else {
            //initialState = EditorState.createEmpty();
            initialState = EditorState.createWithContent(ContentState.createFromText('Hello\r\nworld')); // to test if it can handle new line
        }
        this.state = {editorState: initialState};
    }

    //https://github.com/jpuri/react-draft-wysiwyg/issues/4
    //https://codepen.io/Kiwka/pen/YNYvyG
    render() {
        let classNames = 'mainContainer ';
        if (this.props.selected === true) {
            classNames += ' ctrl-selected'
        }
        const {editorState} = this.state;

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
          if (contentState.getBlockMap().first().getType() !== 'unstyled') {
            className += ' RichEditor-hidePlaceholder';
          }
        }

        return (
            <div className={classNames}>
                <div className="controlLabel">{this.props.data.label}</div>
                <div className="RichEditor-root">
                    <div className={className}>
                        <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        placeholder={this.props.data.placeholder}
                        ref="editor"
                        spellCheck={true}
                        readOnly
                        />
                    </div>
                </div>
            </div>
        );
    }    
}

export default noobControlHoc(RichText);

// Image Props section
export const richTextProps = [
  {
    name: 'richTextData', 
    propType: 'richText',
  },
]