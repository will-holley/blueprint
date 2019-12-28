import styled from "styled-components";
import PropTypes from "prop-types";

const EmojiButton = styled.a`
  cursor: pointer;
  user-select: none;
  font-size: 24px;
  padding: 1rem 0.75rem;
`;

EmojiButton.propTypes = {
  onClick: PropTypes.func.isRequired
};

export { EmojiButton };
