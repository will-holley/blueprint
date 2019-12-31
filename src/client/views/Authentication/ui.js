import styled from "styled-components";

const Container = styled.div`
  padding: 5rem 10rem;
`;

const Input = styled.input`
  font-size: 24px;
  border: 0;
  &:focus {
    outline: 0;
  }
  display: block;
  margin: 2rem 0;
  padding: 1rem 2rem;
  width: 50%;
  border-bottom: 1px dashed #e2e2e2;
`;

export { Container, Input };