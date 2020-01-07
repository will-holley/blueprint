import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

// https://rsms.me/inter/samples/

const H1 = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.07em;
  line-height: 6rem;
`;

const H2 = styled.h2`
  font-weight: 600;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.03em;
`;

const H3 = styled.h3`
  font-weight: 500;
  font-size: 18px;
  line-height: 1;
  letter-spacing: -0.03em;
`;

const H4 = styled.h4`
  font-weight: 600;
  font-size: 16px;
  line-height: 1;
  letter-spacing: -0.03em;
`;

const P = styled.p``;

const A = styled(Link)`
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    border-bottom: 1px solid inherit;
  }
`;

const Input = styled.input`
  font-size: 2rem;
  width: 100%;
  display: block;
`;

const Button = styled.button`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.action};
  background: transparent;
  border: 0;
`;

export { H1, H2, H3, H4, P, A, Input, Button };
