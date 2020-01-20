import styled from "styled-components";

const Container = styled.form`
  padding: 5rem 10rem;
  width: 100%;
`;

const Input = styled.input`
  font-size: 24px;
  border: 0;
  background: transparent;
  &:focus {
    outline: 0;
  }
  display: block;
  margin: 2rem 0;
  padding: 1rem 2rem;
  width: 75%;
  border-bottom: 1px dashed #e2e2e2;
`;

const Checkbox = styled(Input).attrs(props => ({
  type: "checkbox"
}))`
  display: inline-block;
  width: unset;
  margin-right: 1.25rem;
`;

export { Container, Input, Checkbox };
