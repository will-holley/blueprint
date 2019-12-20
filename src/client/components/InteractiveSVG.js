import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useWindowSize } from "client/utils/hooks";

// This function returns an object with X & Y values from the pointer event
function getPointFromEvent(event) {
  var point = { x: 0, y: 0 };
  // If even is triggered by a touch event, we get the position of the first finger
  if (event.targetTouches) {
    point.x = event.targetTouches[0].clientX;
    point.y = event.targetTouches[0].clientY;
  } else {
    point.x = event.clientX;
    point.y = event.clientY;
  }

  return point;
}

const InteractiveSVG = ({ children, displayCorners }) => {
  //! Get the window size.  It is used to set <svg> dimensions.
  const { height, width } = useWindowSize();

  //! Create a ref for tracking the <svg> DOM element.
  const el = useRef(null);

  //! Set up state variables.
  const [isPointerDown, setIsPointerDown] = useState(false);
  // This variable will contain the original coordinates when the user start pressing the mouse or touching the screen
  const [pointerOriginX, setPointerOriginX] = useState(0);
  const [pointerOriginY, setPointerOriginY] = useState(0);
  // We save the original values from the viewBox
  const [viewBoxX, setViewBoxX] = useState(0);
  const [viewBoxY, setViewBoxY] = useState(0);
  // The distances calculated from the pointer will be stored here
  const [newViewBoxX, setNewViewBoxX] = useState(0);
  const [newViewBoxY, setNewViewBoxY] = useState(0);
  // Calculate the ratio based on the viewBox width and the SVG width
  const [ratio, setRatio] = useState(0);

  //! On Mount
  useEffect(() => {
    // Set
    setRatio(width / el.current.getBoundingClientRect().width);
    // Reset when window resizes
    window.addEventListener("resize", function() {
      setRatio(width / el.current.getBoundingClientRect().width);
    });
  }, []);

  //! Event Handlers
  const onPointerDown = event => {
    setIsPointerDown(true);
    // We get the pointer position on click/touchdown so we can get the value
    // once the user starts to drag
    const { x, y } = getPointFromEvent(event);
    setPointerOriginX(x);
    setPointerOriginY(y);
  };

  const onPointerUp = event => {
    setIsPointerDown(false);
    // We save the viewBox coordinates based on the last pointer offsets
    setViewBoxX(newViewBoxX);
    setViewBoxY(newViewBoxY);
  };

  const onPointerMove = event => {
    // Only run this function if the pointer is down
    if (!isPointerDown) return;

    // This prevent user to do a selection on the page
    event.preventDefault();

    // Get the pointer position
    const { x, y } = getPointFromEvent(event);

    // We calculate the distance between the pointer origin and the current position
    // The viewBox x & y values must be calculated from the original values and the distances
    setNewViewBoxX(viewBoxX - (x - pointerOriginX) * ratio);
    setNewViewBoxY(viewBoxY - (y - pointerOriginY) * ratio);
  };

  const viewBoxString = `${newViewBoxX} ${newViewBoxY} ${width} ${height}`;
  //? DEV:
  //console.log(`Viewbox: ${viewBoxString}`);

  return (
    <svg
      ref={el}
      viewBox={viewBoxString}
      style={{ width }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerMove={onPointerMove}
      onMouseDown={onPointerDown}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onMouseMove={onPointerMove}
      onTouchStart={onPointerDown}
      onTouchEnd={onPointerUp}
      onTouchMove={onPointerMove}
    >
      <g>
        {displayCorners && (
          <>
            <rect x="0" y="0" width="20" height="20" />
            <rect x="280" y="0" width="20" height="20" />
            <rect x="0" y="280" width="20" height="20" />
            <rect x="280" y="280" width="20" height="20" />
          </>
        )}

        {children}
      </g>
    </svg>
  );
};

InteractiveSVG.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  displayCorners: PropTypes.bool.isRequired
};

//? DEV
InteractiveSVG.defaultProps = {
  displayCorners: true
};

export default InteractiveSVG;
