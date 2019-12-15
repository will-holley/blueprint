import React from "react";
import propTypes from "prop-types";
import { Input, Button } from "./tags";

const LinkImporter = ({}) => (
  <>
    <div>
      <Input placeholder="..." />
    </div>
    <div>
      <Input placeholder="Add comma separated tags" />
    </div>
    <div>
      <Button>Archive</Button>
    </div>
  </>
);

LinkImporter.defaultProps = {};
LinkImporter.propTypes = {};

export default LinkImporter;
