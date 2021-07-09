import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import "./App.scss";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";

import { AuthProvider } from "./context/auth";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <Router>
          <Container>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
            </Switch>
          </Container>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
