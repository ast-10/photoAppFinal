import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
} from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import "./styles.css";
import axios from "axios";

function UserDetail(props) {
  const [user, setUser] = useState(null);

  const axios_fetchUserFrom = (url) => {
    axios
      .get(url)
      .then((response) => {
        props.onUserNameChange(
          response.data.first_name + " " + response.data.last_name
        );
        props.onLoginUserChange({
          first_name: response.data.logged_user_first_name,
          last_name: response.data.logged_user_last_name,
          id: response.data.logged_user_id,
        });
        setUser(response.data);
      })
      .catch((error) => {
        console.log("Error in UserDetail\n", error.message);
      });
  };

  useEffect(() => {
    axios_fetchUserFrom(`/user2/${props.match.params.userId}`);
  }, [props.match.params.userId]);

  if (props.loginUser || !user) {
    return (
      user && (
        <Grid container spacing={3} className="user-detail-container">
          <Grid item xs={12}>
            <div className="user-info">
              <Typography className="user-info-title">Name:</Typography>
              <Typography className="user-info-content">{`${user.first_name} ${user.last_name}`}</Typography>
            </div>
            <div className="user-info">
              <Typography className="user-info-title">Description:</Typography>
              <Typography className="user-info-content">{`${user.description}`}</Typography>
            </div>
            <div className="user-info">
              <Typography className="user-info-title">Location:</Typography>
              <Typography className="user-info-content">{`${user.location}`}</Typography>
            </div>
            <div className="user-info">
              <Typography className="user-info-title">Occupation:</Typography>
              <Typography className="user-info-content">{`${user.occupation}`}</Typography>
            </div>
          </Grid>

          {user.mostRecentPhotoName && (
            <Grid item xs={12} className="photo-section">
              <Card className="photo-card">
                <CardContent>
                  <Typography className="photo-title">Most Recently Uploaded Photo</Typography>
                </CardContent>
                <CardActionArea to={user && `/photos/${user._id}`} component={Link}>
                  <CardMedia
                    component="img"
                    image={`./images/${user.mostRecentPhotoName}`}
                    alt="Most Recent Photo"
                  />
                </CardActionArea>
                <CardContent>
                  <Typography className="photo-info">{`${user.mostRecentPhotoDate}`}</Typography>
                </CardContent>
              </Card>

              <Card className="photo-card">
                <CardContent>
                  <Typography className="photo-title">Most Commented Photo</Typography>
                </CardContent>
                <CardActionArea to={user && `/photos/${user._id}`} component={Link}>
                  <CardMedia
                    component="img"
                    image={`./images/${user.mostCommentedPhotoName}`}
                    alt="Most Commented Photo"
                  />
                </CardActionArea>
                <CardContent>
                  <Typography className="photo-info">
                    {`${user.commentsCount} comment${user.commentsCount >= 2 ? "s" : ""}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid item className="photo-button-container">
            <Button
              size="large"
              to={user && `/photos/${user._id}`}
              component={Link}
              variant="contained"
              className="see-all-photos-button"
            >
              See All Photos
            </Button>
          </Grid>
        </Grid>
      )
    );
  } else {
    return <Redirect to={`/login-register`} />;
  }
}

export default UserDetail;
