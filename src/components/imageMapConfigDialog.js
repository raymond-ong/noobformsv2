import React, {useState} from 'react';
import {Modal, Header, Button, Icon, Image} from 'semantic-ui-react';
import Form, {Text as FormText, Dropdown as FormDropdown} from '../form/Form';
import './imageMapConfigDialog.css';
import ImageMapper from '../controls/imageMapperLib';

const KEY_NAME = "dropdownImages";

const dummyImages = [
    { key: 'Latest value only', text: 'Latest value only', value: 'Latest value only' },
];

const DEFAULTMAP = {
	name: "imageConfigMap",
    areas: []
}

const DEFAULT_COORDS = {x: -1, y: -1};
const DEFAULT_NAME = 'SPOT X';

const ImageMapConfigDialog = ({showOpenForm, onOpen, onClose}) => {
    // Watch the state, to disable the Save button if it's empty
    const [myState, setMyState] = useState({
        [KEY_NAME]: null});

    const [addingHotspot, setAddingHotspot] = useState(false);
    const [coords, setCoords] = useState(DEFAULT_COORDS); // Current mouse move coordinates
    const [map, setMap] = useState(DEFAULTMAP); // For the image mapper

    const handleHostpotBtnClick = () => {
        setAddingHotspot(!addingHotspot);
    }

    const handleMouseMove = (evt) => {
        if (!addingHotspot) {
            return;
        }     
        const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
        //console.log('handleMouseMove', coords);
        setCoords(coords);
    }

    const handleMouseClick = (evt) => {
        console.log('handleMouseClick');
        setAddingHotspot(false);
        map.areas.push({
            name: DEFAULT_NAME, shape: "circle", coords: [coords.x, coords.y, 15 ], preFillColor: "blue"
        });

        setCoords(DEFAULT_COORDS);
    }

    // console.log('SaveAsDialog render', myState[KEY_NAME]);

    return <Modal open={true}    
        closeOnDimmerClick={true}
        className="imageMapConfigDialog"
        size="fullscreen"
    >
    <Modal.Content className="imageMapContent">
        <div className="imageMapContentContainer">
            <Form className="imageMapForm" onSubmit={(args) => onOpen(args[KEY_NAME])} 
            watchedField={KEY_NAME}
            setStateCb={setMyState}>        
                <div className="formBodyImgMapConfig">
                    <h4>Configure ImageMap Control</h4>

                    <FormDropdown key={'dropdownImages'}
                        name={KEY_NAME}
                        label="Select Image:"
                        options={[]}
                        size="small"
                    />

                    <Button toggle type="button" active={addingHotspot} onClick={handleHostpotBtnClick} disabled={addingHotspot}>
                        <Icon name="plus"/>
                        {addingHotspot ? "Click on a spot in image" : "Add Hotspot"}
                    </Button>
                    {addingHotspot && <div>{`Image coords: ${coords.x}, ${coords.y}`}</div>}

                </div>

                <div className="footerToolbarImgMapConfig">
                <Modal.Actions>
                    <Button floated={'left'} 
                            color='green' 
                            type="submit"      
                    >
                        Apply
                    </Button>
                    <Button floated={'left'} onClick={onClose}>
                        Close            
                    </Button>
                </Modal.Actions>
                </div>
            </Form>
            <div className="imageContainer">
                <ImageMapper src='https://react.semantic-ui.com/images/avatar/large/rachel.png'
                            onImageMouseMove={handleMouseMove}
                            onImageClick={handleMouseClick}
                            map={map}/>
            </div>
        </div>
    </Modal.Content>
    </Modal>;
}

export default ImageMapConfigDialog;