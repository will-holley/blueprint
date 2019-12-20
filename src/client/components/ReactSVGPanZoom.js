import React from "react";
import PropTypes from "prop-types";
import { AutoSizer } from "react-virtualized";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";

const ReactSVGPanZoom = ({ children }) => (
  <AutoSizer>
    {({ width, height }) =>
      width === 0 || height === 0 ? null : (
        <UncontrolledReactSVGPanZoom
          tool="auto"
          toolbarProps={{ position: "none" }}
          miniatureProps={{ position: "none" }}
          width={width}
          height={height}
          detectAutoPan={false}
          background={"transparent"}
          scaleFactor={1}
          // Shrink
          scaleFactorMin={0.4}
          // Enlarge -- by setting value equal to
          // `scaleFactor`, enlarging is disabled.
          scaleFactorMax={1}
        >
          <svg viewBox="0 0 0 0" style={{ height: "auto" }}>
            {children}
          </svg>
        </UncontrolledReactSVGPanZoom>
      )
    }
  </AutoSizer>
);

ReactSVGPanZoom.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default ReactSVGPanZoom;
