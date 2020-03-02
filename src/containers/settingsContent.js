import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form as SemanticForm, Segment, Button} from "semantic-ui-react";
import Form, {Dropdown as FormDropDown} from '../form/Form';
import './settingsContent.css';
import ShowMessage, {NotifType} from '../helper/notification';
import {deleteImage, fetchImages} from '../actions';



export const convertToDropdownOptions = (imagesStrArr) => {
    if (!Array.isArray(imagesStrArr)) {
        return [];
    }

    return imagesStrArr.map(image => {
        return {
            key: image,
            text: image,
            value: image
        };
    })
}


const SettingsContent = () => {
    const reduxStoreImages = useSelector(state => state.mainApp.masterImages);
    const dispatch = useDispatch();

    const handleFormSubmit = (args) => {
        // Actually, this function is called prior to successful submission (todo: fix the timing)
        ShowMessage("Image uploaded!", NotifType.success, "Please refresh the browser to see it in the image lists!");
        // dispatch(fetchImages()); // does not work because this function is called prior to 
    }

    const onSubmitDelete = (formData) => {
        if (!formData || !formData.settingsImageDropdown) {
            return;
        }
    
        let fileName = formData.settingsImageDropdown;
        dispatch(deleteImage(fileName)).then( () => {            
            console.log('deleted image!');
            ShowMessage("Deleted Image!");
            dispatch(fetchImages());
        });
    
        debugger;
    }
    

    return <div className="settingsContentContainer">
        <iframe name="hiddenFrame" className="hiddenFrame"></iframe>
        <Segment>
            <div className="segmentTitle">Upload Image</div>
            <form method="post" 
                className="uploadImageForm"
                encType="multipart/form-data" 
                action="http://localhost:5000/fileupload" 
                target="hiddenFrame"
                onSubmit={handleFormSubmit}>
                <input className="ui button fileInputImageUpload" type="file" name="uploadedFile" accept="image/*"/>
                <br/>
                <br/>
                <input className="ui button primary submitBtnImageUpload" type="submit" name="upload"/>
            </form>
        </Segment>

        <Segment>
            <div className="segmentTitle">Delete Image</div>
            <Form className="deleteImageForm" onSubmit={onSubmitDelete}>
                <FormDropDown
                    name="settingsImageDropdown"
                    options={convertToDropdownOptions(reduxStoreImages)}
                    fluid={false}
                />
                <Button color="red">Delete</Button>
            </Form>
        </Segment>
    </div>
}

export default SettingsContent;