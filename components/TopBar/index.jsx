import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import "./styles.css";
import axios from "axios";

function TopBar(props) {
  const [version, setVersion] = useState(null);
  const [uploadInput, setUploadInput] = useState(null);
  const [alertPromptOpen, setAlertPromptOpen] = useState(false);

  const handleAlertOpen = () => setAlertPromptOpen(true);
  const handleAlertClose = () => setAlertPromptOpen(false);

  const axios_fetchVersion = () => {
    axios
      .get("http://localhost:3000/test/info")
      .then((response) => {
        setVersion(response.data.version);
      })
      .catch((err) => console.log("Error: logout error in posting...", err.message));
  };

  const axios_logoutUser = () => {
    axios
      .post("/admin/logout")
      .then((response) => {
        if (response.status === 200) {
          props.onLoginUserChange(null);
        }
      })
      .catch((err) => console.log("Error: logout error in posting", err.message));
  };

  const axios_sendPhoto = (domForm) => {
    axios
      .post("photos/new", domForm)
      .then((response) => {
        if (response.status === 200) {
          props.onPhotoUpload();
          console.log("TopBar: photo successfully uploaded");
        }
      })
      .catch((err) => console.log("Error: photo uploaded error ", err));
  };

  useEffect(() => {
    axios_fetchVersion();
  }, [props.loginUser]);

  const handleImageUpload = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setUploadInput(file);
    };
  };

  const handlePhotoSubmit = (event) => {
    event.preventDefault();
    const imageToSend = uploadInput;
    setUploadInput(null);

    if (imageToSend.size > 0) {
      const domForm = new FormData();
      domForm.append("uploadedphoto", imageToSend);
      axios_sendPhoto(domForm);
    }
  };

  const handleLogoutPromptClick = () => {
    axios_logoutUser();
  };

  const handleDeleteClick = () => {
    setAlertPromptOpen(false);
    axios
      .post(`/deleteUser/${props.loginUser.id}`)
      .then((response) => {
        if (response.status === 200) {
          handleLogoutPromptClick();
        }
      })
      .catch((err) => console.log("Error deleting account", err.message));
  };

  return (
    <AppBar className="topbar-appBar" position="fixed">
      <Toolbar>
        <Typography variant="h5" className="topbar-title">
          MyPhotoApp
          {props.loginUser && ` v:${version}`}
        </Typography>

        <Typography variant="h5" className="topbar-title">
          {props.loginUser
            ? `Hi, ${props.loginUser.first_name}!`
            : "Please Login or Register if a new user"}
        </Typography>

        {props.loginUser && (
          <Typography variant="h5" className="topbar-title">
            {window.location.href.includes("/photos/") && "Photos of "}
            {window.location.href.includes("/users/") && "Viewing "}
            {props.userName}
          </Typography>
        )}

        {props.loginUser && (
          <form onSubmit={handlePhotoSubmit} className="topbar-form">
            <Button
              component="label"
              title="Add a photo"
              variant="contained"
              className="topbar-addPhoto"
            >
              Add Photo
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            {uploadInput && (
              <Button type="submit" className="topbar-upload">
                Upload
              </Button>
            )}
          </form>
        )}

        <Button
          title="Log out your account"
          onClick={handleLogoutPromptClick}
          className="topbar-logout"
          variant="contained"
        >
          Logout
        </Button>

        {props.loginUser && (
          <React.Fragment>
            <Button
              variant="contained"
              title="Delete your account forever"
              onClick={handleAlertOpen}
              className="topbar-deleteAccount"
            >
              Delete Account
            </Button>
            <Dialog
              open={alertPromptOpen}
              onClose={handleAlertClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Deleting an Account"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {`Delete ${props.loginUser.first_name} ${props.loginUser.last_name}'s account?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleAlertClose}
                  autoFocus
                  color="primary"
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button onClick={handleDeleteClick} color="secondary">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
