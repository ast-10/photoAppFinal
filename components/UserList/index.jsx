import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, Divider, Typography } from "@material-ui/core";
import axios from "axios";
import "./styles.css";

function UserList(props) {
  const [users, setUser] = useState(null);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

  const axios_fetchUser = () => {
    axios
      .get("http://localhost:3000/user/list")
      .then((response) => {
        console.log("UserList: fetched User List");
        setUser(response.data);
      })
      .catch((error) => {
        console.log(`UserList Error: ${error.message}`);
      });
  };

  useEffect(() => {
    axios_fetchUser();
  }, [props.loginUser]);

  const handleClick = (index) => setSelectedButtonIndex(index);

  let userList;

  if (users && props.loginUser) {
    userList = users.map((user, index) => (
      <React.Fragment key={index}>
        <ListItem
          to={`/users/${user._id}`}
          component={Link}
          onClick={() => handleClick(index)}
          button
          className={`user-list-item ${
            selectedButtonIndex === index ? "selected" : ""
          }`}
        >
          <ListItemText
            primary={
              <Typography variant="h6">{user.first_name + " " + user.last_name}</Typography>
            }
          />
        </ListItem>
        <Divider />
      </React.Fragment>
    ));
  }

  return <List component="nav">{userList}</List>;
}

export default UserList;
