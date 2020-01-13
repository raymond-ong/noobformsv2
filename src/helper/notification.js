import React from 'react';
import './notification.css'
import 'react-notifications-component/dist/theme.css';
import { store } from 'react-notifications-component';

const DEFAULT_WIDTH = 400;
const DEFAULT_DURATION = 1200;

export const NotifType = {
    default: 'default',
    success: 'success',
    danger: 'danger',
    warning: 'warning',
    info: 'info'
}

const NotifIcon = {
    success: 'check circle',
    danger: 'exclamation circle',
    warning: 'exclamation triangle',
    info: 'info circle'
}

const defaultProps = {
    type: "default",
    insert: "top",
    container: "top-center",
    animationIn: ["animated", "slideInDown"],
    animationOut: ["animated", "slideOutUp"],
    width: DEFAULT_WIDTH,
    dismiss: {
      duration: DEFAULT_DURATION,
      onScreen: false,
      pauseOnHover: true,
      showIcon: true    // X button to dismiss
    }
};

export const ShowMessage = (titleIn, typeIn=NotifType.default, messageIn=' ') => {
    if (!messageIn) {
        messageIn = ' '
    }

    store.addNotification({
        ...defaultProps,
        title: titleIn,
        message: messageIn,
        type: typeIn,        
    });
}

// TODO: try to show icon
const renderContentWithIcon = (type, iconClassName, message) => {
    // return (
    //     <div className={`notification-custom-${type}`}>
    //         <div className="notification-custom-icon">
    //             {/* <i className={`ui icon ${iconClassName}`}/> */}
    //             <i className={`ui icon save`}/>
    //         </div>
    //         <div className="notification-custom-content">
    //             <p className="notification-message">{message}</p>
    //         </div>
    //     </div>
    // )
    // return (
    //     <div className={`notification-custom-success`}>
    //         <div className="notification-custom-content">
    //         <p className="notification-message">
    //             HElllllllllllllllllllloooooooo            
    //         </p>
    //         </div>
    //     </div>
    // );
    return (<div style={{border: '1px soild red'}}>Hello!</div>)

  }

export default ShowMessage;