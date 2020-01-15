import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import './editDialog.css';

const modalStyle = {
    
  }

class EditDialog extends React.Component {

    render() {
        let {controlInfo} = this.props;
        return (<Modal 
            closeIcon={true}
            closeOnDimmerClick={true}
            trigger={<i className="ui icon cog editBtn" style={modalStyle}></i>}>
            <Modal.Header>Edit Control Dialog for {controlInfo.i}</Modal.Header>
            <Modal.Content>
            <Modal.Description>
                <Header>Under Construction...</Header>
                <p>
                Will be available soon
                </p>    
            </Modal.Description>
            </Modal.Content>
        </Modal>)
    }
}
export default EditDialog
