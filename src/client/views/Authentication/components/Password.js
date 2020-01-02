import React, { useState } from "react";
import PropTypes from "prop-types";
import { Input, Checkbox } from "./../ui";

const Password = ({ onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const updateVisibility = e => setShowPassword(!showPassword);

  return (
    <>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        onChange={onChange}
      />
      <label>
        <Checkbox onChange={updateVisibility} />
        <span>Show password</span>
      </label>
    </>
  );
};

Password.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired
};

export default Password;
