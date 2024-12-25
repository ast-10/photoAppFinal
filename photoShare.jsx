import React, { useState }  from "react";
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';
import './styles/main.css';

import TopBar from './components/TopBar';
import UserDetail from './components/UserDetail';
import UserList from './components/UserList';
import UserPhotos from './components/UserPhotos';
import LoginRegister from './components/LoginRegister';


function PhotoShare() {
  const [photoIsUploaded, setPhotoIsUploaded] = useState(false);
  const [userName, setUserName] = useState(null);     // which user the login user is currently viewing
  const [loginUser, setLoginUser] = useState();   // use to check if an user is logged
 
  const handleUserNameChange = name => {
    console.log("Setting Viewing User to: ", name);
    setUserName(name);
  };

  const handleLoginUserChange = user => {
    console.log("Setting login user to: ", user);
    setLoginUser(user);
  };

  const handlePhotoUpload = () => {
    setPhotoIsUploaded(true);
    setPhotoIsUploaded(false);
  };


  return (
    <HashRouter>
      <div>
        <Grid container spacing={1}>
          
          {/* TopBar View */}
          <Grid item xs={12}>
              <TopBar 
                onLoginUserChange={handleLoginUserChange} 
                onPhotoUpload={handlePhotoUpload} 
                userName={userName} 
                loginUser={loginUser} 
              />
          </Grid>
          <div className="main-topbar-buffer" />

          {/* Sidebar View */}
          <Grid item sm={3} >
            <Paper className="side-bar" elevation={3}>
              <UserList loginUser={loginUser} />
            </Paper>
          </Grid>

          {/* Main View */}
          <Grid item sm={9} >
            <Paper className="main-grid-item" elevation={3}>
              
              <Switch>

                {/* User detail View */}
                <Route path="/users/:userId">
                  {props => (
                    <UserDetail
                      {...props}
                      onUserNameChange={handleUserNameChange}
                      onLoginUserChange={handleLoginUserChange}
                      loginUser={loginUser}
                    />
                  )}
                </Route>

                {/* User photo View */}
                <Route path="/photos/:userId">
                  {props => (
                    <UserPhotos
                      {...props}
                      onUserNameChange={handleUserNameChange}
                      onLoginUserChange={handleLoginUserChange}
                      loginUser={loginUser}
                      photoIsUploaded={photoIsUploaded}
                    />
                  )}
                </Route>

                {/* Login/Register View */}
                <Route path="/login-register">
                  <LoginRegister
                    onLoginUserChange={handleLoginUserChange}
                    loginUser={loginUser}
                  />
                </Route>     

                {/* Defaulted View */}
                <Route>
                  <Redirect to={`/login-register`} />
                </Route>

              </Switch>
            </Paper>
          </Grid>

        </Grid>
      </div>
    </HashRouter>
  );
}


// Create React App
ReactDOM.render(<PhotoShare/>, document.getElementById('photoshareapp'));