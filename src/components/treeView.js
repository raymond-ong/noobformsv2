import React, {Fragment, PureComponent} from 'react';
import {includes} from 'lodash';

import {Treebeard} from 'react-treebeard';
import decorators from 'react-treebeard/dist/components/Decorators/index';
import {Div} from 'react-treebeard/dist/components/common';
//import data from './data';
//import styles from './styles';
//import * as filters from './filter';
import * as filters from '../helper/treefilter';
import style from 'react-treebeard/dist/themes/default';

//import Header from './Header';
//import NodeViewer from './NodeViewer';


const data = {
    name: 'Plant',
    id: 1,
    toggled: true,
    children: [
        {
            name: 'Area001',
            children: [
                { name: 'FIC_001_001' },
                { name: 'FIC_001_002' },
                { name: 'FIC_001_003' },
                { name: 'FIC_001_004' },
                { name: 'FIC_001_005' }
            ]
        },
        {
            name: 'Area002',
            loading: true,
            children: []
        },
        {
            name: 'Area003',
            children: [
                {
                    name: 'components',
                    children: [
                        { name: 'Apple' },
                        { name: 'Banana' },
                        { name: 'Carrot' },
                        { name: 'Dolphin' },
                        { name: 'Elephant' },
                        { name: 'Flower' },
                        { name: 'The quick brown fox jumps over the lazy dog' },
                        { name: 'Abcdefghijklmnopqrstuvwxyz1234567890' },
                    ]
                },
                { name: 'index.js' }
            ]
        },
        {
            name: 'Area004',
            children: [
                { name: 'Star Apple' },
                { name: 'Strawberry Banana' },
                { name: 'Apple Carrot' },
                { name: 'Florida' },
            ]
        },
        { name: 'Test Loop 1' },
        { name: 'Test Loop 2' },
        { name: 'Test Loop 3' },
    ]
};

const styles = {
    component: {
        width: '100%',
        display: 'inline-block',
        verticalAlign: 'top',
        padding: '5px',
    },
    searchBox: {
        // padding: '20px 20px 0 20px',
        border: '1px solid red',
        display: 'flex'
    },
    viewer: {
        base: {
            fontSize: '12px',
            whiteSpace: 'pre-wrap',
            backgroundColor: '#282C34',
            border: 'solid 1px black',
            padding: '20px',
            color: '#9DA5AB',
            minHeight: '250px'
        }
    }
};


// Example: Customising The Header Decorator To Include Icons
const Header = ({onSelect, style, customStyles, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `ui icon ${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base} onClick={onSelect}>
            <Div style={node.selected ? {...style.title, ...customStyles.header.title} : style.title}>
                <i className={iconClass} style={iconStyle}/>
                {node.name}
            </Div>
        </div>
    );
};

Header.defaultProps = {
    customStyles: {}
};


class DemoTree extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {data};
         this.onToggle = this.onToggle.bind(this);
         this.onSelect = this.onSelect.bind(this);
    }
/*
    onToggle(node, toggled) {
        const {cursor, data} = this.state;

        if (cursor) {
            this.setState(() => ({cursor, active: false}));
        }

        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }

        this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }

    onSelect(node) {
        const {cursor, data} = this.state;

        if (cursor) {
            this.setState(() => ({cursor, active: false}));
            if (!includes(cursor.children, node)) {
                cursor.toggled = false;
                cursor.selected = false;
            }
        }

        node.selected = true;

        this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }

    onFilterMouseUp({target: {value}}) {
        const filter = value.trim();
        if (!filter) {
            return this.setState(() => ({data}));
        }
        let filtered = filters.filterTree(data, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState(() => ({data: filtered}));
    }

    render() {
        const {data, cursor} = this.state;
        return (
            <Fragment>
                <Div style={styles.searchBox}>
                    <Div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"/>
                        </span>
                        <input
                            className="form-control"
                            onKeyUp={this.onFilterMouseUp.bind(this)}
                            placeholder="Search the tree..."
                            type="text"
                        />
                    </Div>
                </Div>
                <Div style={styles.component}>
                    <Treebeard
                        data={data}
                        onToggle={this.onToggle}
                        onSelect={this.onSelect}
                        decorators={{...decorators, Header}}
                        customStyles={{
                            header: {
                                title: {
                                    color: 'red'
                                }
                            }
                        }}
                    />
                </Div>
            </Fragment>
        );
    }
*/

    onFilterMouseUp({target: {value}}) {
        const filter = value.trim();
        if (!filter) {
            return this.setState(() => ({data}));
        }
        let filtered = filters.filterTree(data, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState(() => ({data: filtered}));
    }

    onToggle(node, toggled) {
        const {cursor, data} = this.state;

        if (cursor) {
            this.setState(() => ({cursor, active: false}));
        }

        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }

        this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }

    onSelect(node) {
        const {cursor, data} = this.state;

        if (cursor) {
            this.setState(() => ({cursor, active: false}));
            if (!includes(cursor.children, node)) {
                cursor.toggled = false;
                cursor.selected = false;
            }
        }

        node.selected = true;

        //this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }    

    render() {
        const {data, cursor} = this.state;
        console.log(decorators);
        // style.tree.base.backgroundColor = 'inherit';
        // style.tree.base.color = 'black';
        // style.tree.base.fontFamily = 'inherit';
        // style.tree.node.header.base.color = 'black';
        // style.tree.node.loading.color = 'inherit';
        // style.tree.node.activeLink.background = 'inherit';
        
        return (
            <Fragment>
                <div class="ui icon input small" style={{margin: "5px", width: "calc(100% - 10px)"}}>
                    <input type="text" placeholder="Search tree..." onKeyUp={this.onFilterMouseUp.bind(this)}/>
                    <i class="inverted circular search icon"></i>
                </div>

                <Div style={styles.component}>
                    <Treebeard
                        data={data}
                        onToggle={this.onToggle}
                        //onSelect={this.onSelect}
                        decorators={{...decorators, Header}}
                    />
                </Div>

            </Fragment>
        );
    }    
}

export default DemoTree;