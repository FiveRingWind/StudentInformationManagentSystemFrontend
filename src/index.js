import React from 'react';
import ReactDOM from 'react-dom';
import {Router, useRouterHistory} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

// import main style dependency file
import './index.css';


const history = useRouterHistory(createBrowserHistory)({
    basename: '/'       // to serve this template from subdirectory, change the base path.
})
ReactDOM.render(
    <Router history={history} routes={routes}/>,
    document.getElementById('root')
);
