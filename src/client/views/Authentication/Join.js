import React, { useState } from "react";
// Components
import GradientText from "client/components/GradientText";
import { H1, H2, H3, H4 } from "client/components/tags";
import { Container, Input, Button } from "./ui";
import { RightActions, ActionLink, ActionDivider } from "client/layout/Actions";
// Hooks
import { useTransition, animated } from "react-spring";
import { useHistory } from "react-router-dom";
// Data
import useStore from "client/data/store";

const Join = () => {
  const { push } = useHistory();
  const [_, actions] = useStore();

  //? Set up state variables
  const [name, setName] = useState(null);
  const [nameEntered, setNameEntered] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  //! Change Handlers
  const handleNameChange = ({ target: { value } }) => {
    if (value === "") setNameEntered(false);
    setName(value);
  };
  const handleEmailChange = ({ target: { value } }) => {
    if (!nameEntered && name !== "") setNameEntered(true);
    setEmail(value);
  };
  const handlePasswordChange = ({ target: { value } }) => setPassword(value);

  //! Submit Handler
  const submit = async event => {
    setError(null);
    setLoading(true);
    const response = await actions.join(name, email, password);
    if (response && response.error) {
      console.error(response);
      setError(response.error);
      setLoading(false);
    } else {
      push("/");
    }
  };

  //! Transitions
  //$ Subtitle transition
  const nameTransition = useTransition(nameEntered, null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  //$ Submit Button
  const buttonTransition = useTransition(
    name && email && password && !loading,
    null,
    {
      from: { position: "absolute", opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
    }
  );

  //! Render

  return (
    <>
      <RightActions>
        <ActionDivider>or</ActionDivider>
        <ActionLink to="/login">Login</ActionLink>
      </RightActions>
      <Container>
        <H1>
          <span style={{ paddingRight: "1.5rem" }}>👋</span>
          <GradientText>Welcome to Blueprint</GradientText>
        </H1>
        <br />
        <H2>
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
        </H2>
        <br />
        <br />
        <br />
        <Input placeholder="What's your name?" onChange={handleNameChange} />
        <Input placeholder="And your email?" onChange={handleEmailChange} />
        <Input
          placeholder="Please enter a password"
          onChange={handlePasswordChange}
        />
        {error && (
          <>
            <br />
            <H4>{error}</H4>
          </>
        )}
        <br />
        {buttonTransition.map(
          ({ item, key, props }) =>
            item && (
              <animated.div style={props} key={key}>
                <GradientText>
                  <H3 onClick={submit} style={{ cursor: "pointer" }}>
                    Join
                  </H3>
                </GradientText>
              </animated.div>
            )
        )}
      </Container>
    </>
  );
};

export default Join;
