import React, { useContext, useState, useEffect, useRef } from "react";
import { FormContext } from "./Form";
import { RHFInput } from "react-hook-form-input";
import { Form as SemanticForm, Popup } from "semantic-ui-react";
import 'draft-js/dist/Draft.css';
import { Editor, EditorState, RichUtils, ContentState, convertToRaw, convertFromRaw } from 'draft-js';
import './FormRichText.css';


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

// class RichText4Form extends React.Component {
//     constructor(props) {
//         super(props);
//         //this.state = {editorState: EditorState.createEmpty()};
//         this.state = {editorState: EditorState.createWithContent(ContentState.createFromText('Hello'))};
//         //let html = '<div><h5>I am an H5 Tag</h5><h4>I am an H4 Tag</h4><p><a href="www.google.com">www.google.com</a></p></div>';
//         //let html = '<p>First sentence</p><p>Second sentence</p><a href="www.google.com">www.google.com</a></p>';
//         let html = '<table><thead><tr><td><b><i>Hello</i></b></td><td>World</td></tr></thead></table>';
//         let options = {
//           entityStyleFn: entity => {
//             const entityType = entity.get('type').toLowerCase();
//             if (entityType === 'link') {
//               const data = entity.getData();
//               return {
//                 element: 'a',
//                 attributes: {
//                   target: data.targetOption,
//                   href: data.url
//                 }
//               };
//             }
//           }
//         }
//         //this.state = {editorState: EditorState.createWithContent(stateFromHTML(html, options))};

//         this.focus = () => this.refs.editor.focus();
//         this.onChange = (editorState) => {
//             debugger
//             this.setState({editorState});
//         }

//         this.handleKeyCommand = (command) => this._handleKeyCommand(command);
//         this.onTab = (e) => this._onTab(e);
//         this.toggleBlockType = (type) => this._toggleBlockType(type);
//         this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
//     }

//     _handleKeyCommand(command) {
//         const {editorState} = this.state;
//         const newState = RichUtils.handleKeyCommand(editorState, command);
//         if (newState) {
//           this.onChange(newState);
//           return true;
//         }
//         return false;
//       }

//       _onTab(e) {
//         const maxDepth = 4;
//         this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
//       }

//       _toggleBlockType(blockType) {
//         this.onChange(
//           RichUtils.toggleBlockType(
//             this.state.editorState,
//             blockType
//           )
//         );
//       }

//       _toggleInlineStyle(inlineStyle) {
//         this.onChange(
//           RichUtils.toggleInlineStyle(
//             this.state.editorState,
//             inlineStyle
//           )
//         );
//       }

//     //https://github.com/jpuri/react-draft-wysiwyg/issues/4
//     //https://codepen.io/Kiwka/pen/YNYvyG
//     render() {
//         const {editorState} = this.state;

//         // If the user changes block type before entering any text, we can
//         // either style the placeholder or hide it. Let's just hide it now.
//         let className = 'RichEditor-editor';
//         var contentState = editorState.getCurrentContent();
//         if (!contentState.hasText()) {
//           if (contentState.getBlockMap().first().getType() !== 'unstyled') {
//             className += ' RichEditor-hidePlaceholder';
//           }
//         }

//         return (<div className="RichEditor-root">
//                 <div className="toolBarStrip">
//                     {/* Inline Controls: Bold, Italic etc */}
//                     <InlineStyleControls
//                     editorState={editorState}
//                     onToggle={this.toggleInlineStyle}
//                     />
//                     {/* Block Controls: H1, H2, BlockQuote, Code etc */}
//                     <BlockStyleControls
//                     editorState={editorState}
//                     onToggle={this.toggleBlockType}
//                     />
//                 </div>

//                 <div className={className} onClick={this.focus}>
//                     <Editor
//                     blockStyleFn={getBlockStyle}
//                     customStyleMap={styleMap}
//                     editorState={editorState}
//                     handleKeyCommand={this.handleKeyCommand}
//                     onChange={this.onChange}
//                     onTab={this.onTab}
//                     ref="editor"
//                     spellCheck={true}
//                     backgroundColor={'red'}
//                     />
//                 </div>
//             </div>
//         );
//     }    
// }

// START: For the toolbar
class StyleButton extends React.Component {
    constructor() {
      super();
      this.onToggle = (e) => {
        e.preventDefault();
        this.props.onToggle(this.props.style);
      };
    }

    render() {
      let className = 'RichEditor-styleButton';
      if (this.props.active) {
        className += ' RichEditor-activeButton';
      }

      return (
        <span className={className} onMouseDown={this.onToggle}>
          {this.props.label}
        </span>
      );
    }
}

const BLOCK_TYPES = [
  {label: 'H1', style: 'header-one'},
  {label: 'H2', style: 'header-two'},
  {label: 'H3', style: 'header-three'},
  {label: 'Blockquote', style: 'blockquote'},
  {label: 'UL', style: 'unordered-list-item'},
  {label: 'OL', style: 'ordered-list-item'},
  {label: 'Code', style: 'code-block'},
];

const BlockStyleControls = (props) => {
  const {editorState} = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};

var INLINE_STYLES = [
  {label: 'Bold', style: 'BOLD'},
  {label: 'Italic', style: 'ITALIC'},
  {label: 'Underline', style: 'UNDERLINE'},
  {label: 'Monospace', style: 'CODE'},
];

const InlineStyleControls = (props) => {
  var currentStyle = props.editorState.getCurrentInlineStyle();
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
    </div>
  );
};
// END - For the toolbar


// === This is the main control ===
//rules: for isRequired
function FormRichText({ name, rules, label, toolTip, initialData, ...rest }) {
  const { register, setValue, unregister } = useContext(FormContext);
  const refEditor = useRef(null);

  let initialState;
  if (initialData) {
      initialState = EditorState.createWithContent(convertFromRaw(initialData));
  }
  else {
      //initialState = EditorState.createEmpty();
      initialState = EditorState.createWithContent(ContentState.createFromText('Hello\r\nworld')); // to test if it can handle new line
  }
  const [editorState, setEditorState] = useState(initialState);

  const handleChange = ([e]) => {
      const contentState = editorState.getCurrentContent();
      const rawContent = convertToRaw(contentState);
      setEditorState(e);
      return {
          value: rawContent
      };
  }

  const onChange = (currEditorState) => {
    setEditorState(currEditorState);
  }

  const _toggleInlineStyle = (inlineStyle) => {
    onChange(
      RichUtils.toggleInlineStyle(
        editorState,
        inlineStyle
      )
    );
  }

  const _handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return true;
    }
    return false;
  }

  const _onTab = (e) => {
    const maxDepth = 4;
    onChange(RichUtils.onTab(e, editorState, maxDepth));
  }

  const _toggleBlockType = (blockType) => {
    onChange(
      RichUtils.toggleBlockType(
        editorState,
        blockType
      )
    );
  }

  const focusHandler = () => {
    if (refEditor) {
      refEditor.current.focus();
    }
  }

  let className = 'RichEditor-editor';
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  return (<SemanticForm.Field>
      {label && <label>
          <span key={'label-'+name}>{label}</span>
          &nbsp;
          {!!toolTip && <Popup 
              inverted
              basic
              size='tiny' style={{opacity: '0.8'}} 
              content={toolTip}
              trigger={<div style={{display: 'inline-block', color: 'gray'}}>
              <i className="ui icon info circle"/>
              </div>} />
          }
      </label>}
      <div className="RichEditor-root">
        <div className="toolBarStrip">
          {/* Inline Controls: Bold, Italic etc */}
          <InlineStyleControls
          editorState={editorState}
          onToggle={_toggleInlineStyle}
          />
          {/* Block Controls: H1, H2, BlockQuote, Code etc */}
          <BlockStyleControls
          editorState={editorState}
          onToggle={_toggleBlockType}
          />
        </div>
      
      <div className={className} onClick={focusHandler}>
        <RHFInput
            as={<Editor  
                    key={name} 
                    editorState={editorState}
                    ref={refEditor}

                    blockStyleFn={getBlockStyle}
                    customStyleMap={styleMap}
                    handleKeyCommand={_handleKeyCommand}
                    onTab={_onTab}

                    {...rest}>                        
                    </Editor>
            }

        defaultValue=""
        name={name}      
        register={register}
        unregister={unregister}
        setValue={setValue}
        rules={rules}
        onChangeEvent={handleChange}
        />
      </div>
    </div>
  </SemanticForm.Field>
  );
}

export default FormRichText;