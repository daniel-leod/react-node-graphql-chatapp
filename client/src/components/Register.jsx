import React, { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

function Register(props) {
  const [variables, setVariables] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [register, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => props.history.push("/login"),
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();
    register({ variables });
  };

  return (
    <Row className="justify-content-center " lg={2}>
      <Col sm={8} md={6} lg={4} className="login-box">
        <h1 className="text-center">Sign Up</h1>
        <Form onSubmit={submitRegisterForm}>
          <Form.Group>
            <div className="user-box">
              <input
                className={errors.email && "is-invalid"}
                type="email"
                value={variables.email}
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
              />
              <label className={errors.email && "text-danger"}>
                {errors.email ?? "Email address"}
              </label>
            </div>
          </Form.Group>

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
          <Form.Group>
            <div className="user-box">
              <input
                className={errors.confirmPassword && "is-invalid"}
                type="password"
                value={variables.confirmPassword}
                onChange={(e) =>
                  setVariables({
                    ...variables,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <label className={errors.confirmPassword && "text-danger"}>
                {errors.confirmPassword ?? "Confirm password"}
              </label>
            </div>
          </Form.Group>
          <div className="container">
            <button className="button-l" disabled={loading}>
              {loading ? "loading..." : "Register"}
            </button>
            <br />
            <br />
            <small>
              Already have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </Form>
      </Col>
    </Row>
  );
}

export default Register;
