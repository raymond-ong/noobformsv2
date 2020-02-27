import React, {useEffect, useState} from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import { bindActionCreators } from "redux";
import "./designerForm.css";
import BarChart from '../charts/barChart';
import Example from '../charts/pieChart';
import Combobox from '../controls/combo';
import EditDialog from './editDialog';
import {selectedControl} from '../actions/index';
import { useDrop } from 'react-dnd';

// controls import
import Section from '../controls/section';
import RichText from '../controls/richtext';
import Combo from '../controls/combo';

import {connect} from 'react-redux';

// TODO: Delete this whole file...this is just for playing with RGL library
// But we ended up implementing our own designer

//const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ResponsiveReactGridLayout = Responsive;

const defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function(layout, layouts) {
      console.log('layout changed');
      // TODO: handle the layout changes to the other breakpoints here
      // e.g. if curr display is big, fix the layout for xs
  },
  cols: { lg: 12, md: 12, sm: 2, xs: 1, xxs: 1 },
  //initialLayout: generateLayout(),
  initialLayout: [],
  compactType: 'vertical', // It's better to have a vertical compaction, because the drag behaviour is weird without it

  // temporarily set layout to fixed, to avoid conflict while experimenting with rich text editor's cursor/focus
  // isDraggable: false,
  // isResizable: false,
};

/*
const getRechartSample = (i) => {
  if (i === 1)
  {
    let barInfo = {i: 'ctrl-pie0', x: 6, y: 1, w: 3, h: 4, ctrlType: 'pie',       
      data: {
          label: 'Pie:',
      }
    };           

    return <div style={{width: "100%", height: "100%"}}>
        <BarChart {...barInfo}/>
    </div>
  }
  else if (i === 2) {    
    let ctrlInfo = {i: 'ctrl-pie0', x: 6, y: 1, w: 3, h: 4, ctrlType: 'pie',       
      data: {
          label: 'Pie:',
      }
    };    
    return <Example sample={1} {...ctrlInfo}/>
  }
  else if (i === 0) {
    return <div className="Aligner">
        <div className="Aligner-item" style={{fontSize: "30px"}}>Plant Overall Status</div>
    </div>
  }
  else if (i === 3) {
    return <Combo data={{
      label: 'Courses',
      options: [
      { key: 'angular', text: 'Angular', value: 'angular' },
      { key: 'css', text: 'CSS', value: 'css' },
      { key: 'design', text: 'Graphic Design', value: 'design' },
      { key: 'ember', text: 'Ember', value: 'ember' },
      { key: 'html', text: 'HTML', value: 'html' },
      { key: 'ia', text: 'Information Architecture', value: 'ia' },
      { key: 'javascript', text: 'Javascript', value: 'javascript' },
      { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
      { key: 'meteor', text: 'Meteor', value: 'meteor' },
      { key: 'node', text: 'NodeJS', value: 'node' },
      { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
      { key: 'python', text: 'Python', value: 'python' },
      { key: 'rails', text: 'Rails', value: 'rails' },
      { key: 'react', text: 'React', value: 'react' },
      { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
      { key: 'ruby', text: 'Ruby', value: 'ruby' },
      { key: 'ui', text: 'UI Design', value: 'ui' },
      { key: 'ux', text: 'User Experience', value: 'ux' },
    ]}}/>
  }

  return null;
}
*/

const dropdownOptions = [
  { key: 'angular', text: 'Angular', value: 'angular' },
  { key: 'css', text: 'CSS', value: 'css' },
  { key: 'design', text: 'Graphic Design', value: 'design' },
  { key: 'ember', text: 'Ember', value: 'ember' },
  { key: 'html', text: 'HTML', value: 'html' },
  { key: 'ia', text: 'Information Architecture', value: 'ia' },
  { key: 'javascript', text: 'Javascript', value: 'javascript' },
  { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
  { key: 'meteor', text: 'Meteor', value: 'meteor' },
  { key: 'node', text: 'NodeJS', value: 'node' },
  { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
  { key: 'python', text: 'Python', value: 'python' },
  { key: 'rails', text: 'Rails', value: 'rails' },
  { key: 'react', text: 'React', value: 'react' },
  { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
  { key: 'ruby', text: 'Ruby', value: 'ruby' },
  { key: 'ui', text: 'UI Design', value: 'ui' },
  { key: 'ux', text: 'User Experience', value: 'ux' },
  { key: 'test1', text: 'A quick brown fox jumps over the lazy dog', value: 'test1' },
  { key: 'test2', text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+', value: 'test2' },
  { key: 'test3', text: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。', value: 'test3' },
];

const onClickEditBtn= (id) => {
console.log('onClickEditBtn', id);
}

const renderContent = (control) => {
  switch(control.ctrlType) {
    case 'barchart':
      let barInfo = {i: 'ctrl-bar0', x: 6, y: 1, w: 3, h: 4, ctrlType: 'barchart',       
        data: {
            label: 'Bar:',
        }
      };           

    return <BarChart {...barInfo}/>
    case 'pie':
      let ctrlInfo = {i: 'ctrl-pie0', x: 6, y: 1, w: 3, h: 4, ctrlType: 'pie',       
        data: {
            label: 'Pie:',
        }
      };
      return <Example {...ctrlInfo}/>
    case 'section':
      return <div className="Aligner">
      <div className="Aligner-item" style={{fontSize: "30px"}}>Plant Overall Status</div>
      </div>
    case 'combo':
      let comboInfo = {
        i: 'ctrl-pie0', x: 6, y: 1, w: 3, h: 4, ctrlType: 'dummy',      
        data: {
          placeholder: 'Please select...',
          options: dropdownOptions,
          label: 'Combobox:'
        }
      };
      return <Combobox {...comboInfo}></Combobox>
  }
}

const generateDOM = (layouts) => {  
  console.log('[designerForm] generateDOM()...', layouts);
  return _.map(layouts.lg, function(l, i) {
    return (
      <div key={l.i} className={l.static ? "static" : ""} style={{border: "1px dashed lightgray", borderRadius: "3px"}}>
          {/* <span className="text">{i} - {l.i}</span> */}
          {/* <i className="editBtn icon cog large" onClick={me.onClickEditBtn.bind(me, l)}/>             */}
          <EditDialog controlInfo={l}/>
          {/* {getRechartSample(i)} */}
          {renderContent(l)}
          {/* {me.renderControl(l)} */}
      </div>
    );
  });
}

const onBreakpointChange = breakpoint => {
  console.log('onBreakpointChange', breakpoint);
  this.setState({
      currentBreakpoint: breakpoint
  });
};

const onCompactTypeChange = () => {
  const { compactType: oldCompactType } = this.state;
  const compactType =
    oldCompactType === "horizontal"
      ? "vertical"
      : oldCompactType === "vertical" ? null : "horizontal";
  this.setState({ compactType });
};

const onLayoutChange = (layout, layouts) => {
  this.props.onLayoutChange(layout, layouts);
};

const onDragStart = (item) => {
  this.props.onDragStart(item);
}

const onDragStop = (item, item2) => {
  this.props.onDragStop(item);
}

const onNewLayout = () => {
  this.setState({
    layouts: { lg: generateLayout() }
  });
};

const onControlClicked = (control) => {
  console.log('[designerForm] controlClicked fired by HOC', control);
  this.props.selectedControl(control.i);
}

const onDrop = (elemParams, arg2) => {
  let internalLayout = null;
  if (!arg2) {
      // I manually modified the params of OnDrop from the STRML library
      // The second arg is the temp layout
      console.log('[onDrop] arg2 is null. Please modify the STRML library to pass the layout as 2nd argument');
      return;
  }
  internalLayout = arg2;

  if (!this.props.draggingToolItem) {
    console.log('[onDrop] Did not detect any dragging item from toolbox');
    return;
  }

  let newLayout = internalLayout.filter(x => x.i !== '__dropping-elem__').map(item => {
      return {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          i: item.i,
          static: item.static
      }
  }) 

  this.setState({
      layouts: {
        lg: [...newLayout, {
            x: elemParams.x,
            y: elemParams.y,
            w: elemParams.w,
            h: elemParams.h,
            i: this.props.draggingToolItem.name + this.state.layouts.lg.length,
            static: false
        }, ]
      }
    });
};

// try playing around recharts
const DesignerForm = (props) => {

  // Note: this will cause a rerender
  useEffect(() => {
    // Set the initial values
    console.log('RGL useEffect start');
    // If this line of code was removed, it will become "choppy" while dragging elements
    setMyState({ ...myState, mounted: true });
  }, [props.controls]); // Means if controls value does not change, don't run useEffect again.

  const [myState, setMyState] = useState({
    mounted: false,
    layouts: {
      lg: props.controls
    }
  });


  console.log('render RGL');
  return (
    // <div>HelloWorld</div>
    <div style={{border: "1px dashed dimgray", position: 'relative', top: '30px'}}>
      <ResponsiveReactGridLayout 
        width={props.containerWidth}
        {...props}
        initialLayout={props.controls}
        layouts={myState.layouts}
        // onBreakpointChange={this.onBreakpointChange}
        // onLayoutChange={this.onLayoutChange}
        // onDrop={this.onDrop}
        // WidthProvider option
        measureBeforeMount={false}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        // Ray note: set this to false to avoid interfering with dropdown menu
        // Actually, if not in design mode, this should be off
        useCSSTransforms={myState.mounted}
        //useCSSTransforms={false}
      //   compactType={this.state.compactType}
      //   preventCollision={!this.state.compactType}
        isDroppable={true}
      >
        {generateDOM(myState.layouts)}
      </ResponsiveReactGridLayout>
    </div>
  );
}

function generateLayout() {
    // I think @design mode, do not allow small display size
    // If want to design @small display size, when enlarged, everything is fully stretched out, width-wise
      return [
        {i: 'a', x: 0, y: 2, w: 4, h: 10},
        {i: 'b', x: 4, y: 2, w: 4, h: 10},
        {i: 'c', x: 0, y: 0, w: 12, h: 2},
        {i: 'd', x: 8, y: 2, w: 4, h: 2},
        {i: 'e', x: 8, y: 4, w: 4, h: 2},
        {i: 'f', x: 8, y: 6, w: 4, h: 2},
        {i: 'g', x: 8, y: 8, w: 4, h: 2},
      ];
}


const mapDispatchToProps = dispatch => {
  return bindActionCreators({ selectedControl }, dispatch);
}

function mapStateToProps(state, ownProps) {
  return { 
    //draggingToolItem: state.mainApp.draggingToolItem,
    // Problem if you monitor this store variable:
    // If user makes a selection, this entire grid and all its child items re-renders
    // TODO: try this to potentially avoid rerender:
    // - state design: controls dictionary <controlId, controlData>
    // - control mapStateToProps: monitor control[id] only (get the id from ownProps)
    // => Basically this will lead to a prop change, that's why whole component rerenders
    //selectedControlId: state.designer.selectedControlId
    // layout: state.designer.dashLayout
  };
}

DesignerForm.defaultProps = defaultProps;

//export default designerForm;
export default connect(mapStateToProps, mapDispatchToProps)(DesignerForm);
