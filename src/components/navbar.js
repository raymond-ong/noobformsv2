import React, {Component} from 'react';
import {Responsive, Sidebar, Menu} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { menuClicked } from '../actions/index';

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
                    {/* {getNavBarMenuItemElements(this.props.menuClickDispatcher, false)} */}
                    {getNavBarMenuItemElements(this.handleMenuClick, false)}
                </Sidebar>

                {/* Put here the application content, including the fixed menu...basically this is the whole screen */}
                <Sidebar.Pusher 
                    dimmed={this.state.burgerPushed}
                    style={{ height: "100vh" }}
                    onClick={this.handleSidebarHide}>
                    <div className="ui menu inverted fixed top">
                        <div className="header item">
                            Noobforms v2.0
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

const NavBarDesktop = (props) => {
    // Note: putting fixed makes the menu position to be absolute. therefore child elemnets need to adjust manually
    return <div className="ui menu inverted fixed top">
        <div className="header item">
            Noobforms v2.0
        </div>
        {getNavBarMenuItemElements(props.menuClickDispatcher, true)}
    </div>;
}

// const onMenuClicked = (evt, menuName, ) => {
//     // Dispatch an action to the redux store
//     console.log(this.props);
// }

const getNavBarMenuItemElements = (menuClickDispatcher, withAlignment) => {
    return navBarMenuItems.map(child => {
        let itemClass = `item`;
        if (withAlignment && child.alignment === 'right') {
            itemClass += ' right';
        }

        return <a key={`${child.name}`} className={itemClass} onClick={(evt) => menuClickDispatcher(child.name)}>
            <i className={`icon ${child.icon}`}/>
            {child.title}
        </a>});
}

const getNavbarChildren = (children) => {
    return <div>{children}</div>
}

//const settingsChildren = []; // TODO, for 2nd level children

const navBarMenuItems = [
    { name: 'home',     title: 'Home',      icon: 'home',   alignment: '', },
    { name: 'designer', title: 'Designer',  icon: 'edit',   alignment: '' },
    { name: 'settings', title: 'Settings',  icon: 'cog',    alignment: 'right' },
]

const NavBar = (props) => {
    // a. For mobile, the children should be nested inside the Navbar
    // b. For desktop, the children can be a sibling of the Navbar
    console.log('[NavBar] render...', props);
    return (
        <div>            
            <Responsive {...Responsive.onlyMobile}>
                <NavBarMobile menuClickDispatcher={props.menuClicked}>
                    {getNavbarChildren(props.children)}
                </NavBarMobile>
            </Responsive>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                <NavBarDesktop menuClickDispatcher={props.menuClicked}></NavBarDesktop>
                {getNavbarChildren(props.children)}
            </Responsive>
        </div>
    );
}

// this will become the component props
function mapDispatchToProps(dispatch) {
    return bindActionCreators({ menuClicked }, dispatch);
}

//export default NavBar;
export default connect(null, mapDispatchToProps)(NavBar)