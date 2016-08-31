import React from 'react';
import configureStore from '../store';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, IndexRedirect, hashHistory } from 'react-router';
import App from './app.jsx';
import SitesIndex from './sites/sites_index_container.js';
import { requestSites, requestSite } from '../actions/site_actions.js';
import SiteDetail from './sites/site_detail_container.js';
import Sidebar from './ui/sidebar.jsx';
import Home from './home.jsx';
import RegistrationModal from './registration/registration_modal.jsx';

const validateUser = (store) => {
  return (nextState, replace) => {
    if (!store.getState().session.currentUser) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  };
};

const takeCurrentUserToSites = (store) => {
  return (nextState, replace) => {
    if (store.getState().session.currentUser) {
      replace('/sites');
    }
  };
};

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Home} onEnter={takeCurrentUserToSites(store)}>
        <Route path="login" component={RegistrationModal}/>
        <Route path="signup" component={RegistrationModal}/>
      </Route>
      <Route path="/sites" onEnter={validateUser(store)}>
        <IndexRoute component={SitesIndex} onEnter={() => store.dispatch(requestSites())}/>
        <Route path=":siteId" component={Sidebar} onEnter={state => store.dispatch(requestSite(state.params.siteId))}>
          <IndexRedirect to='editor' />
          <Route path="editor" component={SiteDetail}/>
          <Route path="store" component={() => <div>Store</div>}/>
          <Route path="analytics" component={() => <div>Analytics</div>}/>
          <Route path="settings" component={() => <div>Settings</div>}/>
        </Route>
      </Route>
    </Router>
  </Provider>
);

export default Root;
