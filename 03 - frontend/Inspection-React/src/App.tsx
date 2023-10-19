import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { oktaConfig } from './lib/oktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';

import { MessagesPage } from './layouts/MessagesPage/MessagesPage';

import { SearchProjectsPage } from './layouts/SearchProjects/SearchProjectsPage';
import { ProjectInspectPage } from './layouts/ProjectInspectPage/ProjectInspectPage';
import { InspectorReviewsListPage } from './layouts/ProjectInspectPage/InspectionReviewsList/InspectorReviewsListPage';
import { MainPage } from './layouts/InspectionPortal/MainPage';
import { Report } from './layouts/Utils/Report';
import { ProjectManagementPage } from './layouts/ProjectManagement/ProjectManagementPage';
import { AllReports } from './layouts/ProjectManagement/Components/AllReports';
const oktaAuth = new OktaAuth(oktaConfig);
export const App = () => {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();
  
  const restoreOriginalUri = async (_oktaAuth:any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
      <SecureRoute path='/reports/:projectId'><AllReports/></SecureRoute>
      <Route path='/search'>
            <SearchProjectsPage/>
      </Route>
      <Navbar />
      <div className='flex-grow-1'>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/home' />
          </Route>

          <Route path='/home'>
            <HomePage />
          </Route>

          <Route path='/reviewList/:projectId'>
            <InspectorReviewsListPage/>
          </Route>

          <Route path='/checkout/:projectId'>
            <ProjectInspectPage/>
          </Route>

          <Route path='/report'>
            <Report/>
          </Route>

          <Route path='/login' render={
            () => <LoginWidget config={oktaConfig}/>
            }
            />
          <Route path='/login/callback' component={LoginCallback}/>
          
          <SecureRoute path='/messages'><MessagesPage/></SecureRoute>
          <SecureRoute path='/inspection/:projectId'><MainPage/></SecureRoute>          
          <SecureRoute path='/admin'><ProjectManagementPage/></SecureRoute>
        </Switch>
      </div>
      <Footer />
      </Security>
    </div>
  );
}
