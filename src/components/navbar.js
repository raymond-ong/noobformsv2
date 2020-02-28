import React, {Component} from 'react';
import {Responsive, Sidebar, Menu} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { menuClicked } from '../actions/index';

// START: Mobile View
class NavBarMobile extends Component {    
    constructor(props) {
        super(props);
        this.handleSidebarHide = this.handleSidebarHide.bind(this);
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
        this.state = {
            burgerPushed: false
        };
    }

    handleSidebarHide() {
        if (this.state.burgerPushed) {
            this.setState({burgerPushed: false})
        }
    }

    handleSidebarToggle() {
        this.setState({burgerPushed: !this.state.burgerPushed})
    }

    // Create a separate function for the mobile version because we need to hide the sidebar afterwards
    // We also set the active menu item
    // Also, next time maybe we need a dirty check
    handleMenuClick = (menuName) => {
        this.props.menuClickDispatcher(menuName);
        this.handleSidebarToggle();
    }

    render() {
        return <Sidebar.Pushable>
                {/* Put here the sidebar that appears in and out */}
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    inverted
                    vertical
                    visible={this.state.burgerPushed}
                    width='thin'
                    direction='right'
                    icon='labeled'
                    size='mini'
                >
                    {getNavBarMenuItemElements(this.handleMenuClick, this.props.activeItem, false)}
                </Sidebar>

                {/* Put here the application content, including the fixed menu...basically this is the whole screen */}
                <Sidebar.Pusher 
                    dimmed={this.state.burgerPushed}
                    style={{ height: "100vh" }}
                    onClick={this.handleSidebarHide}>
                    <div className="ui menu inverted fixed top">
                        <div className="header item">
                            {/* My Dashboard */}
                        </div>
                        <a className="item right" onClick={this.handleSidebarToggle}>
                            <i className="icon sidebar"/>
                        </a>
                    </div>
                    {this.props.children}
                </Sidebar.Pusher>                
            </Sidebar.Pushable>;
    }
}
// END: Mobile View

// START: Desktop View
const NavBarDesktop = (props) => {
    // Note: putting fixed makes the menu position to be absolute. therefore child elemnets need to adjust manually
    return <div className="ui menu inverted fixed top" style={{'backgroundImage': 'linear-gradient(#454545, black)'}}>
        <div className="header item">
            {/* My Dashboard */}
        </div>
        {getNavBarMenuItemElements(props.menuClickDispatcher, props.activeItem, true)}
    </div>;
}

const onMenuClicked = (menuName, menuClickDispatcher) => {
    // Dispatch an action to the redux store
    menuClickDispatcher(menuName);
    // Set the active item
}

const getNavBarMenuItemElements = (menuClickDispatcher, activeItem, withAlignment) => {
    return navBarMenuItems.map(child => {
        let itemClass = `item`;
        if (withAlignment && child.alignment === 'right') {
            itemClass += ' right';
        }
        if (activeItem == child.name) {
            itemClass += ' active';
        }

        return <a key={`${child.name}`} className={itemClass} onClick={(evt) => onMenuClicked(child.name, menuClickDispatcher)}>
            <i className={`icon ${child.icon}`}/>
            {child.title}
        </a>});
}
// END: Desktop View

const getNavbarChildren = (children) => {
    return <div>{children}</div>
}

//const settingsChildren = []; // TODO, for 2nd level children

const navBarMenuItems = [
    { name: 'mapView',     title: 'Map View',      icon: 'map pin',   alignment: '', },
    { name: 'analysisView',     title: 'Analysis',      icon: 'braille',   alignment: '', },
    { name: 'home',     title: 'Plant Manager View',      icon: 'home',   alignment: '', },
    { name: 'downloadCenter',     title: 'Download Center',      icon: 'cloud donwload',   alignment: '', },

    { name: 'formsDesigner', title: 'Page Designer',  icon: 'edit',   alignment: '' },
    { name: 'hierarchyDesigner', title: 'Hierarchy Designer',  icon: 'list',   alignment: '' },
    { name: 'dataSources', title: 'Data Sources',  icon: 'database',   alignment: '' },

    { name: 'dashboardDesigner', title: '(delete)',  icon: 'chart area',   alignment: '' },    
    { name: 'dataDesigner', title: '(delete)',  icon: 'cube',   alignment: '' },
    { name: 'trialPage', title: '(trial)',  icon: 'gavel',    alignment: '' },
    { name: 'settings', title: 'Settings',  icon: 'cog',    alignment: 'right' },
]

const NavBar = (props) => {
    let activeItem = props.activeMenu;
    // a. For mobile, the children should be nested inside the Navbar
    // b. For desktop, the children can be a sibling of the Navbar
    return (
        <div>            
            <Responsive {...Responsive.onlyMobile}>
                <NavBarMobile menuClickDispatcher={props.menuClicked} activeItem={activeItem}>
                    {getNavbarChildren(props.children)}
                </NavBarMobile>
            </Responsive>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                <NavBarDesktop menuClickDispatcher={props.menuClicked} activeItem={activeItem}></NavBarDesktop>
                {getNavbarChildren(props.children)}
            </Responsive>
        </div>
    );
}

// this will become the component props
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ menuClicked }, dispatch);
}

function mapStateToProps(state) {
    return { activeMenu: state.mainApp.activeMenu };
  }

//export default NavBar;
export default connect(mapStateToProps, mapDispatchToProps)(NavBar)