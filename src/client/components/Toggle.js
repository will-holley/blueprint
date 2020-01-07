import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Container = styled.span``;

const Divider = styled.span`
  margin: 0 1rem;
`;

const Option = styled.span`
  font-size: 2rem;
  color: ${({ active, theme }) => (active ? theme.colors.action : "inherit")};
  cursor: ${({ active }) => (active ? "default" : "pointer")};
`;

const Toggle = ({ a, b, active, handleClick }) => {
  return (
    <Container onClick={handleClick}>
      <Option active={active === "a"}>{a}</Option>
      <Divider>/</Divider>
      <Option active={active === "b"}>{b}</Option>
    </Container>
  );
};

Toggle.propTypes = {
  a: PropTypes.string.isRequired,
  b: PropTypes.string.isRequired,
  active: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default Toggle;
