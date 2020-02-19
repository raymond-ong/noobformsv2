import React, {useState} from 'react';
import {Modal, Header, Button, Icon} from 'semantic-ui-react';
import Form, {Text as FormText, Dropdown as FormDropdown} from '../form/Form';

const KEY_NAME = "Name";

const OpenDialog = ({showOpenForm, title, formLabel, onOpen, onClose, options}) => {
    // Watch the state, to disable the Save button if it's empty
    const [myState, setMyState] = useState({
        [KEY_NAME]: null});

    // console.log('SaveAsDialog render', myState[KEY_NAME]);

    return <Modal open={showOpenForm}    
    size='mini'
    closeOnDimmerClick={true}
    className="openModal"
    >
    <Header icon='folder' content={title} />
    <Modal.Content scrolling>
    <Form onSubmit={(args) => onOpen(args[KEY_NAME])} 
        watchedField={KEY_NAME}
        setStateCb={setMyState}>
        <FormDropdown key={'Open-' + KEY_NAME}
            name={KEY_NAME}
            label={formLabel}
            options={options}
        />
    <Modal.Actions>
        <Button floated={'right'} 
                color='green' 
                type="submit"      
                disabled={!myState[KEY_NAME] || myState[KEY_NAME].length === 0}          
        >
            Open
        </Button>
        <Button floated={'right'} onClick={onClose}>
            Cancel            
        </Button>
    </Modal.Actions>    

    </Form>                 
    </Modal.Content>
    </Modal>;
}

export default OpenDialog;