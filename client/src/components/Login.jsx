import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      token
      createdAt
    }
  }
`;

function Login(props) {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const [login, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted: (data) => {
      dispatch({ type: "LOGIN", payload: data.login });
      props.history.push("/");
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();
    login({ variables });
  };

  return (
    <Row className="justify-content-center " lg={2}>
      <Col sm={8} md={6} lg={4} className="login-box">
        <h1 className="text-center">Sign In</h1>
        <Form onSubmit={submitLoginForm}>
          <Form.Group className="user-box">
            <div className="user-box">
              <input
                className={errors.username && "is-invalid"}
                type="text"
                value={variables.username}
                onChange={(e) =>
                  setVariables({ ...variables, username: e.target.value })
                }
              />
              <label className={errors.username && "text-danger"}>
                {errors.username ?? "Username"}
              </label>
            </div>
          </Form.Group>
          <Form.Group>
            <div className="user-box">
              <input
                className={errors.password && "is-invalid"}
                type="password"
                value={variables.password}
                onChange={(e) =>
                  setVariables({ ...variables, password: e.target.value })
                }
              />
              <label className={errors.password && "text-danger"}>
                {errors.password ?? "Password"}
              </label>
            </div>
          </Form.Group>
          <div className="container">
            <button className="button-l" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
            <br />
            <br />
            <small>
              Don't have an account? <Link to="/register">Register</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
