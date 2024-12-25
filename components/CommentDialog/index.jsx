import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Chip,
  Typography,
} from "@material-ui/core";
import "./styles.css";
import axios from "axios";

function CommentDialog(props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const handleClickOpen = () => {
    setError(null);
    setOpen(true);
  };

  const handleClickClose = () => {
    setComment("");
    setError(null);
    setOpen(false);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    if (event.target.value.trim()) {
      setError(null);
    }
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    const commentText = comment.trim();
    setComment("");
    setOpen(false);

    axios
      .post(`/commentsOfPhoto/${props.photo_id}`, { comment: commentText })
      .then(() => props.onCommentSumbit())
      .catch((err) => console.log(err));
  };

  return (
    <div className="comment-dialog">
      <Chip
        label="Reply"
        onClick={handleClickOpen}
        className="reply-chip"
        aria-label="Add a comment"
      />
      <Dialog open={open} onClose={handleClickClose} aria-labelledby="dialog-title">
        <DialogContent>
          <Typography variant="h6" id="dialog-title" gutterBottom>
            Add a Comment
          </Typography>
          <DialogContentText>
            Share your thoughts below. Be respectful and concise.
          </DialogContentText>
          <TextField
            value={comment}
            onChange={handleCommentChange}
            autoFocus
            multiline
            margin="dense"
            fullWidth
            variant="outlined"
            placeholder="Type your comment here..."
            aria-label="Comment text input"
          />
          {error && (
            <Typography variant="body2" color="error" className="error-text">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} className="cancel-button">
            Cancel
          </Button>
          <Button
            onClick={handleCommentSubmit}
            className="submit-button"
            disabled={!comment.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CommentDialog;
