// React imports
import React from 'react';
import ReactDOM from 'react-dom';
// Redux imports
import { createStore,applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import reducers from "./reducers";
import App from './App';

const store = createStore(reducers, applyMiddleware(thunk));

const main = () => {
    return (<Provider store={store}>
            <App/>
        </Provider>);
}

ReactDOM.render(main(), document.getElementById('root'))