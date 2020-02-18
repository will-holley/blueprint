import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import TextareaAutosize from "react-textarea-autosize";
import { DebounceInput } from "react-debounce-input";

const Container = styled.foreignObject`
  width: ${({ width }) => width}px;
  cursor: default;
  z-index: 2;
  ${({ dev }) => dev && "border: 1px solid black;"}
`;

Container.propTypes = {
  width: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  dev: PropTypes.bool.isRequired
};

const _Input = styled(({ active, ...rest }) => <TextareaAutosize {...rest} />)`
  color: ${({ active, theme }) => (active ? theme.colors.action : "inherit")};
  padding: 1rem 0;
  height: auto;
  width: 100%;
  border: 0;
  resize: none;
  overflow: hidden;
  // * Constrain padding to text to make the entire container clickable.
  text-align: center;
  cursor: ${({ readOnly }) => (readOnly ? "default" : "text")};

  // https://rsms.me/inter/dynmetrics/
  font-size: 15px;
  letter-spacing: -0.00879776em;
  line-height: 21px;

  &:empty:before {
    content: attr(placeholder);
    display: block;
    font-size: 32px;
  }
  &:focus {
    outline: none;
  }
`;

const Text = ({ inputRef, onHeightChange, ...rest }) => {
  // Bind `inputRef` to `_Input` -- It will get swallowed by `DebounceInput` otherwise
  // because both components use the same prop name.

  return (
    <DebounceInput
      element={props => (
        <_Input
          inputRef={inputRef}
          minRows={1}
          onHeightChange={onHeightChange}
          {...props}
        />
      )}
      // Send change event only on blur
      forceNotifyByEnter={false}
      debounceTimeout={-1}
      {...rest}
    />
  );
};

Text.propTypes = {
  active: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  inputRef: PropTypes.shape(PropTypes.Element).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onHeightChange: PropTypes.func.isRequired
};

const NewChildButton = styled.a`
  display: block;
  cursor: pointer;
`;

export { Container, Text, NewChildButton };
