//* Libraries
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

//* Hooks
import { useWindowSize, useWhyDidYouUpdate } from "client/utils/hooks";

const Group = styled(animated.g)`
  opacity: ${({ opacity }) => opacity && opacity};
`;

/**
 * https://css-tricks.com/creating-a-panning-effect-for-svg/
 * @param {object} props
 */
const InteractiveSVG = ({ children, opacity, activeNodeId, zoom }) => {
  //! Get the window size.  It is used to set <svg> dimensions.
  const { height, width } = useWindowSize();

  //! Create a ref for tracking the <svg> DOM element.
  const svg = useRef(null);
  //! Create a ref for tracking the <g> dimensions.
  const group = useRef(null);

  //! Set up pan variables.
  const [isPointerDown, setIsPointerDown] = useState(false);
  // This variable will contain the original coordinates when the user start pressing the mouse or touching the screen
  const [pointerOriginX, setPointerOriginX] = useState(0);
  const [pointerOriginY, setPointerOriginY] = useState(0);
  // We save the original values from the viewBox
  const [viewBoxX, setViewBoxX] = useState(0);
  const [viewBoxY, setViewBoxY] = useState(0);
  // Create an SVG point that contains x & y values
  const [point, setPoint] = useState(null);

  //! On Mount
  useEffect(() => {
    // Set up svg point
    setPoint(svg.current.createSVGPoint());
    // Set up viewbox
    const { x, y } = svg.current.viewBox.baseVal;
    setViewBoxX(x);
    setViewBoxY(y);
  }, []);

  //! This function returns an object with X & Y values from the pointer event
  const getPointFromEvent = ({ targetTouches, clientX, clientY }) => {
    let _point = point;
    _point.x = targetTouches ? targetTouches[0].clientX : clientX;
    _point.y = targetTouches ? targetTouches[0].clientY : clientY;

    // We get the current transformation matrix of the SVG and we inverse it
    var invertedSVGMatrix = svg.current.getScreenCTM().inverse();

    return _point.matrixTransform(invertedSVGMatrix);
  };

  //! Pan Event Handlers
  const handlePointerDown = event => {
    // Only allow panning when user pans on empty canvas
    if (event.target !== svg.current) return;

    setIsPointerDown(true);
    // We get the pointer position on click/touchdown so we can get the value
    // once the user starts to drag
    const { x, y } = getPointFromEvent(event);
    setPointerOriginX(x);
    setPointerOriginY(y);
  };

  const handlePointerUp = event => setIsPointerDown(false);

  const handlePointerMove = event => {
    // Only run this function if the pointer is down
    if (!isPointerDown) return;

    // This prevent user to do a selection on the page
    event.preventDefault();

    // Get the pointer position
    const { x, y } = getPointFromEvent(event);

    // We calculate the distance between the pointer origin and the current position
    // The viewBox x & y values must be calculated from the original values and the distances
    setViewBoxX(viewBoxX - (x - pointerOriginX));
    setViewBoxY(viewBoxY - (y - pointerOriginY));
  };

  //! Activating a node centers it.
  useEffect(() => {
    // By default there is no active node until the user creates a base node.
    if (!activeNodeId) return;
    // Get active node position
    const {
      height: elHeight,
      width: elWidth,
      x: elLeft,
      y: elTop
    } = document.getElementById(activeNodeId).getBBox();
    const elX = elLeft + elWidth * 0.5;
    const elY = elTop + elHeight * 0.5;
    // Determine how far from the center of the viewbox the element currently is
    const xOffset = width / 2 - elX;
    const yOffset = height / 2 - elY;
    setViewBoxY(-yOffset);
    setViewBoxX(-xOffset);
  }, [activeNodeId]);

  //! Animate viewbox transitions
  //$ viewBoxString gets used when mouse is down.  We don't want double
  //$ animations.
  const viewBoxString = `${viewBoxX} ${viewBoxY} ${width} ${height}`;
  const viewBoxXRef = useRef();
  const viewBoxYRef = useRef();
  const heightRef = useRef();
  const widthRef = useRef();
  const viewBoxTransition = useSpring({
    from: {
      viewBox: `${viewBoxXRef.current ? viewBoxYRef.current : 0} ${
        viewBoxYRef.current ? viewBoxYRef.current : 0
      } ${widthRef.current ? widthRef.current : width} ${
        heightRef.current ? heightRef.current : height
      }`
    },
    to: { viewBox: viewBoxString }
  });
  useEffect(() => {
    viewBoxXRef.current = viewBoxX;
    viewBoxYRef.current = viewBoxY;
    widthRef.current = width;
    heightRef.current = height;
  }, [
    viewBoxXRef.current,
    viewBoxYRef.current,
    widthRef.current,
    heightRef.current
  ]);

  //! Animate Zoom
  const zoomRef = useRef(1);
  const animatedZoom = useSpring({
    from: {
      transform: `scale(${zoomRef.current})`
    },
    to: {
      transform: `scale(${zoom})`
    }
  });
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  return (
    <animated.svg
      ref={svg}
      viewBox={isPointerDown ? viewBoxString : viewBoxTransition.viewBox}
      style={{ width }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onMouseMove={handlePointerMove}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
      onTouchMove={handlePointerMove}
    >
      <Group style={animatedZoom} ref={group} opacity={opacity}>
        {children}
      </Group>
    </animated.svg>
  );
};

InteractiveSVG.propTypes = {
  children: PropTypes.array.isRequired,
  opacity: PropTypes.number.isRequired,
  activeNodeId: PropTypes.string,
  zoom: PropTypes.number.isRequired
};

export default InteractiveSVG;
