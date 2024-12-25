import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  List,
  Divider,
  Typography,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { ThumbUp, ThumbUpOutlined } from "@material-ui/icons";
import "./styles.css";
import axios from "axios";
import CommentDialog from "../CommentDialog";

function UserPhotos(props) {
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState(null);

  const axios_fetch_user = (userID) => {
    axios
      .get(`/user/${userID}`)
      .then((response) => {
        setUser(response.data);
        props.onUserNameChange(
          response.data.first_name + " " + response.data.last_name
        );
        props.onLoginUserChange({
          first_name: response.data.logged_user_first_name,
          last_name: response.data.logged_user_last_name,
          id: response.data.logged_user_id,
        });
      })
      .catch((err) => console.log("/user/ Error: ", err));
  };

  const axios_fetch_photos = (userID) => {
    axios
      .get(`/photosOfUser/${userID}`)
      .then((response) => {
        console.log("Printing photos of user: ", response.data);
        setPhotos(response.data);
      })
      .catch((err) => console.log("/photosOfUser/ Error: ", err));
  };

  useEffect(() => {
    axios_fetch_user(props.match.params.userId);
  }, [props.match.params.userId]);

  useEffect(() => {
    axios_fetch_photos(props.match.params.userId);
  }, [props.photoIsUploaded]);

  const handleCommentSumbit = () => {
    axios_fetch_user(props.match.params.userId);
    axios_fetch_photos(props.match.params.userId);
    console.log("Submit was pressed, re-rendering photos and comments");
  };

  const axios_post_handle = (url, info, errMsg) => {
    axios
      .post(url, info)
      .then(() => axios_fetch_photos(props.match.params.userId))
      .catch((err) => console.log(errMsg, err));
  };

  const handlePhotoLike = (photo_id) => {
    axios_post_handle(
      `/like/${photo_id}`,
      { action: props.loginUser.id },
      "Like Update Failure: "
    );
  };

  const handlePhotoDelete = (photo_id) => {
    axios_post_handle(
      `/deletePhoto/${photo_id}`,
      {},
      "Photo Delete Failure: "
    );
  };

  const handleCommentDetele = (comment_id, photo_id) => {
    axios_post_handle(
      `/deleteComment/${comment_id}`,
      { photo_id: photo_id },
      "Comment Delete Failure: "
    );
  };

  const convertDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const likedByLoginUser = (photo) => {
    for (let i = 0; i < photo.likes.length; i++) {
      if (photo.likes[i]._id === props.loginUser.id) return true;
    }
    return false;
  };

  const likesNameList = (photo) => {
    const nameList = photo.likes.map((like) => {
      let name = like.first_name + " " + like.last_name;
      return name;
    });
    return nameList;
  };

  if (props.loginUser || !user || !photos) {
    return (
      user && (
        <Grid
          container
          justifyContent="flex-start"
          spacing={3}
          className="user-photos-container"
        >
          {photos &&
            photos.map((photo) => (
              <Grid item xs={4} key={photo._id}>
                <Card className="photo-card">
                  <CardHeader
                    avatar={
                      <Avatar className="photo-avatar">
                        {user.first_name[0]}
                      </Avatar>
                    }
                    title={
                      <Link to={`/users/${user._id}`}>
                        <Typography>{`${user.first_name} ${user.last_name}`}</Typography>
                      </Link>
                    }
                    subheader={photo.date_time}
                    action={
                      props.loginUser.id === user._id && (
                        <IconButton
                          title="Remove the photo"
                          onClick={() => handlePhotoDelete(photo._id)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      )
                    }
                  />
                  <CardMedia
                    component="img"
                    image={`./images/${photo.file_name}`}
                    alt="Photo"
                  />
                  <Typography variant="button" className="photo-likes">
                    {photo.likes.length > 0
                      ? `Liked by ${likesNameList(photo).join(", ")}`
                      : ``}
                  </Typography>
                  <CardActions>
                    <Button
                      onClick={() => handlePhotoLike(photo._id)}
                      className="like-button"
                    >
                      {likedByLoginUser(photo) ? (
                        <ThumbUp color="secondary" />
                      ) : (
                        <ThumbUpOutlined color="action" />
                      )}
                      <Typography variant="button" style={{ marginLeft: "5px" }}>
                        {photo.likes.length}
                      </Typography>
                    </Button>
                  </CardActions>
                  <CardContent>
                    {photo.comments && (
                      <Typography variant="subtitle1">
                        Comments:
                        <Divider />
                      </Typography>
                    )}
                    {photo.comments.map((c) => (
                      <List key={c._id} className="comments-list">
                        <Typography
                          variant="subtitle2"
                          className="comment-username"
                        >
                          <Link to={`/users/${c.user._id}`}>
                            {`${c.user.first_name} ${c.user.last_name}`}
                          </Link>
                        </Typography>
                        <Typography
                          variant="caption"
                          className="comment-date"
                        >
                          {convertDate(c.date_time)}
                          {props.loginUser.id === user._id && (
                            <IconButton
                              title="Delete the comment"
                              onClick={() =>
                                handleCommentDetele(c._id, photo._id)
                              }
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Typography>
                        <Typography
                          variant="body1"
                          className="comment-text"
                        >{`"${c.comment}"`}</Typography>
                      </List>
                    ))}
                    <CommentDialog
                      onCommentSumbit={handleCommentSumbit}
                      photo_id={photo._id}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          {!photos && (
            <Grid item xs={12}>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                className="no-photo-grid"
              >
                <Typography>
                  This user has not posted any photos yet.
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      )
    );
  }

  return <Redirect to={`/login-register`} />;
}

export default UserPhotos;
