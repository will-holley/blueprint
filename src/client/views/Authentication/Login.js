import React, { useState } from "react";
// Components
import GradientText from "client/components/GradientText";
import { H1, H3 } from "client/components/tags";
import { Container, Input, Button } from "./ui";
import { RightActions, ActionLink, ActionDivider } from "client/layout/Actions";
import Password from "./components/Password";
// Hooks
import { useTransition, animated } from "react-spring";
import { useHistory } from "react-router-dom";
//* Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "client/data/services/user/actions";

const Login = ({ loginHandler }) => {
  const { push } = useHistory();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEmailChange = ({ target: { value } }) => setEmail(value);
  const handlePasswordChange = ({ target: { value } }) => setPassword(value);

  //! Submit Handler
  const submit = async event => {
    setError(null);
    setLoading(true);
    const response = await loginHandler(email, password);
    if (response && response.error) {
      setError(response.error);
      setLoading(false);
    } else {
      push("/");
    }
  };

  //$ Submit Button
  const buttonTransition = useTransition(email && password && !loading, null, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });

  //! Render

  return (
    <>
      <RightActions>
        <ActionDivider>or</ActionDivider>
        <ActionLink to="/join">Join</ActionLink>
      </RightActions>
      <Container>
        <H1>
          <span style={{ paddingRight: "1.5rem" }}>😇</span>
          <GradientText>Welcome back!</GradientText>
        </H1>
        <br />
        <br />
        <br />
        <Input placeholder="What's your email?" onChange={handleEmailChange} />
        <Password
          onChange={handlePasswordChange}
          placeholder="And your password?"
        />
        {error && (
          <>
            <br />
            <H3>{error}</H3>
          </>
        )}
        <br />
        {buttonTransition.map(
          ({ item, key, props }) =>
            item && (
              <animated.div style={props} key={key}>
                <GradientText>
                  <H3 onClick={submit} style={{ cursor: "pointer" }}>
                    Login
                  </H3>
                </GradientText>
              </animated.div>
            )
        )}
      </Container>
    </>
  );
};

Login.propTypes = {
  loginHandler: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  loginHandler: async (email, password) => dispatch(login(email, password))
});

export default connect(null, mapDispatchToProps)(Login);
