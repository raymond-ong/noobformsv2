import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {Modal, Header, Button, Icon, Image} from 'semantic-ui-react';
import Form, {Text as FormText, Dropdown as FormDropdown, FormImageCoord} from '../form/Form';
import './imageMapConfigDialog.css';
import ImageMapper from '../controls/imageMapperLib';
import {convertToDropdownOptions} from '../containers/settingsContent';
import {getAprBaseUrl} from '../api/masterData';
import {applyImageMapProps} from '../actions';

const KEY_NAME = "dropdownImage";

const DEFAULTMAP = {
	name: "imageConfigMap",
    areas: [],
}

const DEFAULT_COORDS = {x: -1, y: -1};
const DEFAULT_NAME = 'SPOT X';

const ImageMapConfigDialog = ({showOpenForm, onCloseOpenConfigDialog, selectedControl}) => {
    let initialImage, initialMap;
    if (selectedControl && selectedControl.data && selectedControl.data.imageProps) {
        initialImage = selectedControl.data.imageProps.image;
        initialMap = selectedControl.data.imageProps.map;
    }

    // Watch the state, to disable the Save button if it's empty
    const [myState, setMyState] = useState({dropdownImage: initialImage}); // bound to the dropdown watch field
    // TODO: Remove all existing hostpots if user changed the image?
    //const [imageName, setImageName] = useState(null); // our own tracking

    const [addingHotspot, setAddingHotspot] = useState(false);
    const [coords, setCoords] = useState(DEFAULT_COORDS); // Current mouse move coordinates
    const [map, setMap] = useState(initialMap || DEFAULTMAP); // For the image mapper
    const reduxStoreImages = useSelector(state => state.mainApp.masterImages);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("imagemap config useEffect", initialMap);
        if (initialImage) {
            setMyState({dropdownImage: initialImage});
        }
        if (initialMap) {
            setMap(initialMap);
        }
    }, [initialImage, initialMap]);

    const handleHostpotBtnClick = () => {
        setAddingHotspot(!addingHotspot);
    }

    // This will be the "permanent name" of the spot.
    // Purpose is just for unique identifier.
    // The user can still change the "display name" though
    const generateSpotName = () => {
        if (!map || !Array.isArray(map.areas)) {
            return "SPOT 0";
        }
        let candidateVal = 0;
        while(true) {
            let candidateName = `SPOT ${candidateVal}`;
            if (!map.areas.find(a => a.name === candidateName)) {
                return candidateName;
            }
            candidateVal++;
        }
    }

    const handleMouseMove = (evt) => {
        if (!addingHotspot) {
            return;
        }     
        const coords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
        //console.log('handleMouseMove', coords);
        //setCoords(coords);
    }

    const handleMouseClick = (evt) => {
        const currCoords = { x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY };
        console.log('handleMouseClick', currCoords);
        setAddingHotspot(false);
        if (!addingHotspot) {
            return;
        }
        if (currCoords.x  < 0 || currCoords.y < 0) {
            return;
        }
        
        let mapClone = {...map};
        setMap(mapClone);
        mapClone.areas = [...map.areas];
        mapClone.areas.push({
            name: generateSpotName(), shape: "circle", coords: [currCoords.x, currCoords.y, 15 ], preFillColor: "red"
        });

        //setCoords(DEFAULT_COORDS);
    }

    const renderCoordsForm = () => {
        console.log('renderCoordsForm', map.areas)
        return <div className="coordContainer">
        {map.areas.map(area => {
            return <FormImageCoord key={"formImageArea-" + area.name} name={area.name}
                x={area.coords[0]}
                y={area.coords[1]}
                color={area.preFillColor}
                />
            })
        }
        </div>
    }

    const handleChangeImage = (evt, data) => {
        // Does not work. Anticipate changes using watchFields
    }

    const handleClose = () => {
        if (!onCloseOpenConfigDialog) {
            return;
        }
        onCloseOpenConfigDialog(false);
    }

    const handleSubmit = (formData) => {
        console.log('handleSubmit, formData:', formData);
        let image = null;
        let areas = [];

        for (let prop in formData) {
            if (prop === "dropdownImage") {
                image = formData[prop];
            }
            else {
                let areaData = formData[prop];
                areas.push({
                    name: areaData.name,
                    shape: "circle", 
                    coords: [areaData.x, areaData.y, 15 ], 
                    preFillColor: areaData.color
                })
            }
        }
        
        let newMap = {
            name: `${selectedControl.i}-imageConfigMap`,
            areas: areas
        };

        console.log('handleSubmit, newMap:', newMap);
        setMap(newMap);
        
        //console.log('handleSubmit, map', map);
        // Fire a redux action
        dispatch(applyImageMapProps(image, newMap, selectedControl));        
    }

    // This function is called every render to initialize the values
    const setHotspotValues = (setValueFunc, mapParam) => {
        if (!map || !Array.isArray(map.areas)) {
            return;
        }

        // if (!Array.isArray(mapParam)) {
        //     return;
        // }

        setValueFunc('dropdownImage', myState.dropdownImage);

        map.areas.forEach(area => {
            setValueFunc(area.name+'.name', area.name); // this is just the display name
            setValueFunc(area.name+'.x', area.coords[0]);
            setValueFunc(area.name+'.y', area.coords[1]);
            setValueFunc(area.name+'.color', area.preFillColor);
        });
    }

    console.log('ImageMapConfigDialog render', map);

    return <Modal open={showOpenForm}  
        closeOnDimmerClick={true}
        className="imageMapConfigDialog"
        size="fullscreen"
    >
    <Modal.Content className="imageMapContent">
        <div className="imageMapContentContainer">
            <Form className="imageMapForm" onSubmit={handleSubmit} 
                watchedField={'dropdownImage'}
                setStateCb={setMyState}
                setControlValues={setHotspotValues}
                inputObj={map}>
                <div className="formBodyImgMapConfig">
                    <h4>Configure ImageMap Control</h4>

                    <FormDropdown key={'dropdownImage'}
                        name={'dropdownImage'}
                        label="Select Image:"
                        options={convertToDropdownOptions(reduxStoreImages)}
                        size="small"
                        // onChange={handleChangeImage}
                    />
                    <Button toggle type="button" active={addingHotspot} onClick={handleHostpotBtnClick} disabled={addingHotspot || !myState || !myState.dropdownImage}>
                        <Icon name="plus"/>
                        {addingHotspot ? "Click on a spot in image" : "Add Hotspot"}
                    </Button>
                    {addingHotspot && <div>{`Image coords: ${coords.x}, ${coords.y}`}</div>}
                    {renderCoordsForm()}
                </div>

                <div className="footerToolbarImgMapConfig">
                <Modal.Actions>
                    <Button floated={'left'}
                            color='green'
                            type="submit"
                    >
                        Apply
                    </Button>
                    <Button floated={'left'} onClick={() => handleClose()}>
                        Close            
                    </Button>
                </Modal.Actions>
                </div>
            </Form>
            <div className="imageContainer">
                {!!myState && !!myState.dropdownImage &&
                <ImageMapper src={`${getAprBaseUrl()}/files/${myState.dropdownImage}`}
                            onImageMouseMove={handleMouseMove}
                            onImageClick={handleMouseClick}
                            map={map}
                />}          
            </div>
        </div>
    </Modal.Content>
    </Modal>;
}

export default ImageMapConfigDialog;