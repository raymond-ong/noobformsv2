import React from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import './editDialog.css';

class EditDialog extends React.Component {

    render() {
        console.log(this.props);
        let {controlInfo} = this.props;
        return (<Modal trigger={<i className="ui icon cog large editBtn"></i>}>
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
