import React from 'react';
import { connect } from 'react-redux';


class PropertiesPanel extends React.Component {
    render() {
        if (!this.props.selectedControlId) {
            return <div className="ui message warning">No control selected in the Designer</div>
        }
        return <div> PropertiesPanel</div>;
    }
}

function mapStateToProps(state) {
    return {
        selectedControlId: state.designer.selectedControlId
    }
  }
  
export default connect(mapStateToProps)(PropertiesPanel);