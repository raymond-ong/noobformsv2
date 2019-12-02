import React from 'react';
import './notification.css'
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

const ShowInfo = (titleIn, messageIn) => {
    store.addNotification({
        title: titleIn,
        message: messageIn,
        type: "default",
        insert: "top",
        container: "top-center",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "zoomOut"],
        dismiss: {
          duration: 2500,
          onScreen: true,
          pauseOnHover: true
        }
      });
}

export const ShowMessage = (titleIn, messageIn, typeIn="default") => {
    store.addNotification({
        title: titleIn,
        message: messageIn,
        type: typeIn,
        insert: "top",
        container: "top-center",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "zoomOut"],
        dismiss: {
          duration: 2500,
          onScreen: true,
          pauseOnHover: true
        }
      });
}

const ShowError = (message) => {
    //toast(message, {className: 'myToast'});
}

export default ShowInfo;