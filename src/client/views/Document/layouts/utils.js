const calculateNodeHeight = id => {
  const el = document.getElementById(id);
  const height = el
    ? Array.from(el.children)
        .map(({ offsetHeight }) => offsetHeight)
        .reduce((acc, height) => (acc += height), 0)
    : 0;
  return height;
};

export { calculateNodeHeight };
