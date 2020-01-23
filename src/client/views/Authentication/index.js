//* React Core
import React, { useState } from "react";
import PropTypes from "prop-types";
//* Components
import GradientText from "client/components/GradientText";
import { H1, H2, H3, P } from "client/components/tags";
import {
  RightActions,
  ActionLink,
  ActionDivider
} from "client/components/Actions";
import Password from "./components/Password";
import { Container, Input, Button } from "./components/ui";
//* Hooks
import { useTransition, animated, Transition } from "react-spring";
import { useHistory } from "react-router-dom";
//* Graphql
import { useMutation, gql } from "@apollo/client";
import { DashboardQuery } from "client/views/Dashboard";

const RegistrationMutation = gql`
  mutation AuthenticationRegistrationMutation(
    $email: String!
    $password: String!
  ) {
    registerUser(input: { email: $email, password: $password }) {
      jwtToken
    }
  }
`;

const LoginMutation = gql`
  mutation AuthenticationLoginMutation($email: String!, $password: String!) {
    loginUser(input: { email: $email, password: $password }) {
      jwtToken
    }
  }
`;

const Authentication = () => {
  const {
    push,
    location: { pathname }
  } = useHistory();

  //? Set up state variables
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //? Determine if this is login or join
  const isLogin = pathname === "/login";

  //? Register mutation hooks
  const mutationFunction = isLogin ? "loginUser" : "registerUser";
  const [authenticate] = useMutation(
    isLogin ? LoginMutation : RegistrationMutation,
    {
      variables: { email, password },
      refetchQueries: ({
        data: {
          [mutationFunction]: { jwtToken }
        }
      }) => {
        window.localStorage.setItem("jwt", jwtToken);
        return [{ query: DashboardQuery }];
      },
      awaitRefetchQueries: true,
      onCompleted: () => push("/")
    }
  );

  //! Change Handlers
  const handleEmailChange = ({ target: { value } }) => setEmail(value);
  const handlePasswordChange = ({ target: { value } }) => setPassword(value);

  //! Submit Handler
  const submit = async event => {
    setError(null);
    setLoading(true);
    authenticate();
  };

  const canSubmit = email && password && !loading;

  return (
    <>
      <RightActions>
        <ActionDivider>or</ActionDivider>
        <ActionLink to={isLogin ? "/join" : "/login"}>
          {isLogin ? "Join" : "Login"}
        </ActionLink>
      </RightActions>
      <Container>
        <H1>
          <span style={{ paddingRight: "1.5rem" }}>👋</span>
          <GradientText>
            {isLogin ? "Login" : "Welcome"} to Blueprint
          </GradientText>
        </H1>
        <br />
        {/* <H2>
          {nameTransition.map(({ item, key, props }) =>
            item ? (
              <animated.div style={props} key={key}>
                Hi {name}, it's lovely to meet you!
              </animated.div>
            ) : (
              <animated.div style={props} key={key}>
                To join the community, introduce yourself.
              </animated.div>
            )
          )}
        </H2> */}
        <br />
        <br />
        <Input placeholder="What's your email?" onChange={handleEmailChange} />
        <Password
          placeholder="Please enter a password"
          onChange={handlePasswordChange}
        />
        {error && (
          <>
            <br />
            <P>{error}</P>
          </>
        )}
        <br />
        <Transition
          items={canSubmit}
          from={{
            position: "absolute",
            opacity: 0
          }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {canSubmit => props =>
            canSubmit && (
              <animated.div style={props}>
                <GradientText>
                  <H2 onClick={submit} style={{ cursor: "pointer" }}>
                    Go
                  </H2>
                </GradientText>
              </animated.div>
            )}
        </Transition>
      </Container>
    </>
  );
};

export default Authentication;
