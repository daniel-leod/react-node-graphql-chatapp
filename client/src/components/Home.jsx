import React, { Fragment, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/auth";

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      email
      createdAt
    }
  }
`;

export default function Home({ history }) {
  const dispatch = useAuthDispatch();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    history.push("/login");
  };

  const { loading, data, error } = useQuery(GET_USERS);

  if (error) {
    console.log(error);
  }

  if (data) {
    console.log(data);
  }

  let usersMarkup;
  if (!data || loading) {
    usersMarkup = <p>Loading...</p>;
  } else if (data.getUsers.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (data.getUsers.length > 0) {
    usersMarkup = data.getUsers.map((user) => (
      <div key={user.username}>
        <p>{user.username}</p>
      </div>
    ));
  }
  return (
    <Fragment>
      <Row className="my-3 justify-content-end">
        <Link className="mx-4" to="/login">
          <a>Login</a>
        </Link>
        <Link className="mx-4" to="/register">
          <a>Register</a>
        </Link>
        <a className="ml-4" onClick={logout}>
          Logout
        </a>
      </Row>
      <Row className="xxx">
        <Col xs={4}>{usersMarkup}</Col>
        <Col xs={8}>
          <p>Messages</p>
        </Col>
      </Row>
    </Fragment>
  );
}
