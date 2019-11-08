
import React from "react";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./designerForm.css";
import BarChart from '../charts/barChart';
import Example from '../charts/pieChart';

import {connect} from 'react-redux';


//const ResponsiveReactGridLayout = WidthProvider(Responsive);
const ResponsiveReactGridLayout = Responsive;

// try playing around recharts
class designerForm extends React.Component {

  constructor(props) {
    super(props);
    this.ReactGridLayout = React.createRef();
  }

  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function(layout, layouts) {
        console.log('layout changed');
        // TODO: handle the layout changes to the other breakpoints here
        // e.g. if curr display is big, fix the layout for xs
    },
    cols: { lg: 12, md: 12, sm: 2, xs: 1, xxs: 1 },
    //cols: { lg: 12, xs: 1},
    initialLayout: generateLayout(),
    compactType: 'vertical', // It's better to have a vertical compaction, because the drag behaviour is weird without it
    onDragStart: function(item) {
        console.log('onDragStart', item);
    },
    onDragStop: function(item) {
        console.log('onDragStop', item);
    },

  };

  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: this.props.initialLayout },
    potentialLayout: {}
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  getRechartSample = (i) => {
      if (i === 0)
      {
        return <div style={{width: "100%", height: "100%"}}>
            
            <BarChart/>
        </div>
      }
      else if (i === 1) {
        return <Example/>
      }
      else if (i === 2) {
        return <div style={{textAlign: "center", fontSize: "30px"}}>Overall Plant Performance</div>
      }

      return null;
  }

  generateDOM() {
    var me = this;
    return _.map(this.state.layouts.lg, function(l, i) {
      return (
        <div key={l.i} className={l.static ? "static" : ""} style={{border: "1px solid lightgray", borderRadius: "3px"}}>
            <span className="text">{i} - {l.i}</span>
            <i className="editBtn icon cog large"/>
            {me.getRechartSample(i)}
        </div>
      );
    });
  }

  onBreakpointChange = breakpoint => {
    console.log('onBreakpointChange', breakpoint);
        this.setState({
            currentBreakpoint: breakpoint
        });
  };

  onCompactTypeChange = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical" ? null : "horizontal";
    this.setState({ compactType });
  };

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onDragStart = (item) => {
    this.props.onDragStart(item);
  }

  onDragStop = (item, item2) => {
      console.log('dragend1', item2);
      console.log('dragend2', item);
      this.props.onDragStop(item);
  }
  onNewLayout = () => {
    this.setState({
      layouts: { lg: generateLayout() }
    });
  };

  onDrop = (elemParams, arg2) => {
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

    if (this.ReactGridLayout) {
      //internalLayout = this.ReactGridLayout.state.layout 
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

  render() {

    console.log('render RGL');
    return (
      <div>
        <ResponsiveReactGridLayout style={{width: "100%", border: "1px dashed dimgray"}}
          //ref={r => this.ReactGridLayout = r}
          ref={this.ReactGridLayout}
          width={this.props.containerWidth}
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          onDragStart={this.onDragStart}
          onDragStop={this.onDragStop}
          //onDrag={this.onDrag}
          onDrop={this.onDrop}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
        //   compactType={this.state.compactType}
        //   preventCollision={!this.state.compactType}
          isDroppable={true}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

function generateLayout() {
    // I think @design mode, do not allow small display size
    // If want to design @small display size, when enlarged, everything is fully stretched out, width-wise
      return [
        {i: 'a', x: 0, y: 2, w: 4, h: 10},
        {i: 'b', x: 4, y: 2, w: 4, h: 10},
        {i: 'c', x: 0, y: 0, w: 12, h: 2}
      ];
}

/* TODO
const mapDispatchToProps = dispatch => {
  return bindActionCreators({ toolItemDragged }, dispatch);
} */

function mapStateToProps(state) {
  return { draggingToolItem: state.mainApp.draggingToolItem };
}

//export default designerForm;
export default connect(mapStateToProps)(designerForm);
