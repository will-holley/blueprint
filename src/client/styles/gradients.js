// http://gradients.io/
const gradients = [
  ["#2E3192", "#1BFFFF"],
  ["#D4145A", "#FBB03B"],
  ["#009245", "#FCEE21"],
  ["#662D8C", "#ED1E79"],
  ["#ED1C24", "#FCEE21"],
  ["#00A8C5", "#FFFF7E"],
  ["#D74177", "#FFE98A"],
  ["#FB872B", "#D9E021"],
  ["#312A6C", "#852D91"],
  ["#B066FE", "#63E2FF"],
  ["#808080", "#E6E6E6"],
  ["#8E78FF", "#FC7D7B"],
  ["#00537E", "#3AA17E"],
  ["#FCA5F1", "#B5FFFF"],
  ["#D585FF", "#00FFEE"],
  ["#F24645", "#EBC08D"],
  ["#3A3897", "#A3A1FF"],
  ["#45145A", "#FF5300"],
  ["#333333", "#5A5454"],
  ["#4F00BC", "#29ABE2"],
  ["#00B7FF", "#FFFFC7"]
];

// Get a random gradient for page style
function getRandomGradient() {
  const [colorA, colorB] = gradients[
    Math.floor(Math.random() * gradients.length)
  ];
  return `linear-gradient(90deg, ${colorA}, ${colorB});`;
}

export default gradients;
export { getRandomGradient };
