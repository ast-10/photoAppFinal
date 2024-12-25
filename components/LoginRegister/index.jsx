import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Typography, Grid, FormControl, InputLabel, Input, Button } from '@material-ui/core';
import './styles.css';

function LoginRegister({ loginUser, onLoginUserChange }) {
  const [state, setState] = useState({
    loginId: '',
    loginName: '',
    password: '',
    loginMessage: '',
    newLoginName: '',
    firstName: '',
    lastName: '',
    description: '',
    location: '',
    occupation: '',
    newPassword: '',
    newPassword2: '',
    registeredMessage: '',
  });

  const handleInputChange = ({ target }) => {
    setState({ ...state, [target.name]: target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    axios
      .post('/admin/login', {
        login_name: state.loginName,
        passwordClearText: state.password,
      })
      .then((response) => {
        console.log('LoginRegister: loggin Success!');
        console.log('Printing response.data: ', response.data);
        setState({ ...state, loginId: response.data.id });
        onLoginUserChange(response.data);
      })
      .catch((error) => {
        console.log('LoginRegister: loggin Fail!');
        setState({ ...state, loginMessage: error.response.data.message });
        onLoginUserChange(null);
      });
  };

  const getNewUser = () => {
    const newUser = {
      login_name: state.newLoginName,
      passwordClearText: state.newPassword,
      first_name: state.firstName,
      last_name: state.lastName,
      location: state.location,
      description: state.description,
      occupation: state.occupation,
    };

    setState({
      ...state,
      newLoginName: '',
      newPassword: '',
      newPassword2: '',
      firstName: '',
      lastName: '',
      location: '',
      description: '',
      occupation: '',
    });

    return newUser;
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (state.newPassword !== state.newPassword2) {
      setState({ ...state, registeredMessage: 'The two passwords are NOT the same, please try again' });
      return;
    }

    axios
      .post('/user', getNewUser())
      .then((response) => {
        console.log('LoginRegister: new User register Success!');
        setState({ ...state, registeredMessage: response.data.message });
      })
      .catch((error) => {
        console.log('LoginRegister: new User loggin Fail!');
        setState({ ...state, registeredMessage: error.response.data.message });
      });
  };

  const customForm = (inputLabel, id, type, value, required, autoFocus = false) => {
    return (
      <FormControl fullWidth>
        <InputLabel htmlFor={id}>{inputLabel}</InputLabel>
        <Input
          name={id}
          id={id}
          autoFocus={autoFocus}
          autoComplete="on"
          type={type}
          value={value}
          onChange={handleInputChange}
          required={required}
          className="custom-input"
        />
      </FormControl>
    );
  };

  if (loginUser) {
    return <Redirect from="/login-register" to={`/users/${state.loginId}`} />;
  }

  return (
    <Grid container className="login-register-container">
      {/* Login Form */}
      <Grid container item direction="column" alignItems="center" xs={6} className="login-form-container">
        <Typography variant="h5" className="form-title">Log In</Typography>
        <Grid item xs={8}>
          <form onSubmit={handleLoginSubmit}>
            {customForm('Login Name', 'loginName', 'text', state.loginName, true, true)}
            {customForm('Password', 'password', 'password', state.password, true)}
            <br />
            <br />
            <Button
              type="submit"
              disabled={state.loginName.length === 0}
              fullWidth
              variant="contained"
              color="primary"
              className="login-button"
            >
              Login
            </Button>
            <br />
            <br />
            {state.loginMessage && <Typography className="login-message">{state.loginMessage}</Typography>}
          </form>
        </Grid>
      </Grid>

      {/* Register Form */}
      <Grid container item direction="column" alignItems="center" xs={6} className="register-form-container">
        <Typography variant="h5" className="form-title">Create New Account</Typography>
        <Grid item xs={8}>
          <form onSubmit={handleRegisterSubmit}>
            {customForm('Login Name*', 'newLoginName', 'text', state.newLoginName, true)}
            {customForm('First Name*', 'firstName', 'text', state.firstName, true)}
            {customForm('Last Name*', 'lastName', 'text', state.lastName, true)}
            {customForm('New Password*', 'newPassword', 'password', state.newPassword, true)}
            {customForm('Verify Password*', 'newPassword2', 'password', state.newPassword2, true)}
            {customForm('Description', 'description', 'text', state.description)}
            {customForm('Location', 'location', 'text', state.location)}
            {customForm('Occupation', 'occupation', 'text', state.occupation)}
            <br />
            <br />
            <Button
              type="submit"
              disabled={state.newLoginName.length === 0}
              fullWidth
              variant="contained"
              color="primary"
              className="register-button"
            >
              Register Me!
            </Button>
            <br />
            <br />
            {state.registeredMessage && (
              <Typography className={`registered-message ${state.registeredMessage.includes('successfully') ? 'success' : 'error'}`}>
                {state.registeredMessage}
              </Typography>
            )}
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LoginRegister;
