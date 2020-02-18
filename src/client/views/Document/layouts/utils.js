const calculateNodeHeight = id => {
  const el = document.getElementById(id);
  let height = 0;
  if (el) {
    Array.from(el.children).forEach(child => {
      height += child.offsetHeight;
    });
  }
  return height;
};

const arrayToIdMap = array => {
  const map = {};
  array.forEach(item => {
    map[item.id] = Object.assign({}, item);
  });
  return map;
};

export { calculateNodeHeight, arrayToIdMap };
