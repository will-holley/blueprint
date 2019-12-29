const calculateNodeHeight = id => {
  const el = document.getElementById(id);
  return el
    ? Array.from(el.children)
        .map(({ offsetHeight }) => offsetHeight)
        .reduce((acc, height) => (acc += height), 0)
    : 100;
};

export { calculateNodeHeight };
