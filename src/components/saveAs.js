import React, {useState} from 'react';
import {Modal, Header, Button, Icon} from 'semantic-ui-react';
import Form, {Text as FormText, IconSelector, ColorSelector} from '../form/Form';

const KEY_NAME = "Name";

const SaveAsDialog = ({showSaveForm, title, formLabel, onSave, onClose}) => {
    // Watch the state, to disable the Save button if it's empty
    const [myState, setMyState] = useState({
        [KEY_NAME]: null});

    // console.log('SaveAsDialog render', myState[KEY_NAME]);

    return <Modal open={showSaveForm}    
    size='mini'
    closeOnDimmerClick={true}
    className="saveAsModal"
    >
    <Header icon='save' content={title} />
    <Modal.Content scrolling>
    <Form onSubmit={(args) => onSave(args[KEY_NAME])} 
        watchedField={KEY_NAME}
        setStateCb={setMyState}>
        <FormText key={'SaveAs-' + KEY_NAME}
            name={KEY_NAME}
            label={formLabel}
        />
    <Modal.Actions>
        <Button floated={'right'} 
                color='green' 
                type="submit"
                disabled={!myState[KEY_NAME] || myState[KEY_NAME].length === 0}
        >
            Save
        </Button>
        <Button floated={'right'} onClick={onClose}>
            Cancel            
        </Button>
    </Modal.Actions>    

    </Form>                 
    </Modal.Content>
    </Modal>;
}

export default SaveAsDialog;