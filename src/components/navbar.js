import React, {Component} from 'react';
import {Responsive, Sidebar, Menu} from 'semantic-ui-react';

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
                    {getNavBarMenuItemElements(false)}
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

const NavBarDesktop = () => {
    // Note: putting fixed makes the menu position to be absolute. therefore child elemnets need to adjust manually
    return <div className="ui menu inverted fixed top">
        <div className="header item">
            Noobforms v2.0
        </div>
        {getNavBarMenuItemElements(true)}
    </div>;
}

const getNavBarMenuItemElements = (withAlignment) => {
    return navBarMenuItems.map(child => {
        let itemClass = `item`;
        if (withAlignment && child.alignment === 'right') {
            itemClass += ' right';
        }

        return <a key={`${child.icon}`} className={itemClass}>
            <i className={`icon ${child.icon}`}/>
            {child.content}
        </a>});
}

const getNavbarChildren = (children) => {
    return <div>{children}</div>
}

const settingsChildren = []; // TODO, for 2nd level children

const navBarMenuItems = [
    { content: 'Home',      icon: 'home',   alignment: '', },
    { content: 'Designer',  icon: 'edit',   alignment: '' },
    { content: 'Settings',  icon: 'cog',    alignment: 'right' },
]

const NavBar = (props) => {
    // a. For mobile, the children should be nested inside the Navbar
    // b. For desktop, the children can be a sibling of the Navbar

    return (
        <div>            
            <Responsive {...Responsive.onlyMobile}>
                <NavBarMobile>
                    {getNavbarChildren(props.children)}
                </NavBarMobile>
            </Responsive>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                <NavBarDesktop></NavBarDesktop>
                {getNavbarChildren(props.children)}
            </Responsive>
        </div>
    );
}

export default NavBar;