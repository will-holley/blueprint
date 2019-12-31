import React, { useState } from "react";
// Components
import GradientText from "client/components/GradientText";
import { H1, H3 } from "client/components/tags";
import { Container, Input, Button } from "./ui";
// Hooks
import { useTransition, animated } from "react-spring";
import { useHistory } from "react-router-dom";
// Data
import useStore from "client/data/store";

const Login = () => {
  const [_, actions] = useStore();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleEmailChange = ({ target: { value } }) => setEmail(value);
  const handlePasswordChange = ({ target: { value } }) => setPassword(value);

  //! Submit Handler
  const submit = event => {};

  //$ Submit Button
  const buttonTransition = useTransition(name && email && password, null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  //! Render

  return (
    <Container>
      <H1>
        <span style={{ paddingRight: "1.5rem" }}>😇</span>
        <GradientText>Welcome back!</GradientText>
      </H1>
      <br />
      <br />
      <br />
      <Input placeholder="What's your email?" onChange={handleEmailChange} />
      <Input placeholder="And your password?" onChange={handlePasswordChange} />
      <br />
      {buttonTransition.map(
        ({ item, key, props }) =>
          item && (
            <animated.div style={props}>
              <GradientText dynamic>
                <H3 onClick={submit}>Login</H3>
              </GradientText>
            </animated.div>
          )
      )}
    </Container>
  );
};

export default Login;
