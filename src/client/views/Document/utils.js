const calibrateX = n => windowWidth / 2 + n - width / 2;
const calibrateY = n => windowHeight / 2 + n - height / 2;

/**
 * Calibrates the coordinate to the center of the window.
 * @param {Number} coordinate : x or y value
 * @param {Number} windowDimension : height or width
 * @param {Number} nodeDimension : height or width
 */
function calibratePosition(coordinate, windowDimension, nodeDimension) {
  return windowDimension / 2 + coordinate - nodeDimension / 2;
}

//? How many pixels should be between nodes
const yBottomPadding = 75;

export { calibratePosition, yBottomPadding };
