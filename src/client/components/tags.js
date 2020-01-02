import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

const H1 = styled.h1`
  font-size: 72px;
  font-weight: 700;
`;

const H2 = styled.h2`
  font-size: 36px;
  font-weight: 700;
`;

const H3 = styled.h3`
  font-size: 24px;
`;

const H4 = styled.h4`
  font-size: 18px;
`;

const H5 = styled.h5`
  font-size: 16px;
`;

const P = styled.p``;

const A = styled(Link)`
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
`;

export { H1, H2, H3, H4, H5, P, A, Input, Button };
