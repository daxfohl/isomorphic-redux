import React                from 'react';
import { render }           from 'react-dom';
import { Router }           from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Provider }         from 'react-redux';
import * as reducers        from 'reducers';
import routes               from 'routes';
import promiseMiddleware    from 'lib/promiseMiddleware';
import { createStore,
         combineReducers,
         applyMiddleware }  from 'redux';
import Immutable from 'immutable';

const history = createBrowserHistory();

const reducer = combineReducers(reducers);
console.log(window.__INITIAL_STATE__);
const store   = applyMiddleware(promiseMiddleware)(createStore)(reducer, window.__INITIAL_STATE__);

render(
  <Provider store={store}>
    <Router children={routes} history={history} />
  </Provider>,
  document.getElementById('react-view')
);
