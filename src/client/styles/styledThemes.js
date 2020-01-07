const white = "white";
const black = "#222";
const blackGradient = "linear-gradient(45deg,#040404 0%,#020202 100%)";
const actionBlue = "#2997ff";

const makeTheme = ({
  textColor,
  background,
  altBackground,
  altText,
  actionColor
}) => ({
  text: {
    color: textColor,
    alt: altText
  },
  background,
  altBackground,
  colors: {
    action: actionColor
  }
});

const dark = makeTheme({
  textColor: white,
  background: blackGradient,
  altBackground: white,
  altText: black,
  actionColor: actionBlue
});
const light = makeTheme({
  textColor: black,
  background: white,
  altBackground: blackGradient,
  altText: white,
  actionColor: actionBlue
});

export { dark, light };
