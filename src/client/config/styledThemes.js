const makeTheme = ({ textColor, background }) => ({
  text: {
    color: textColor
  },
  background: background
});

const dark = makeTheme({
  textColor: "white",
  background: "linear-gradient(45deg,#040404 0%,#020202 100%)"
});
const light = makeTheme({ textColor: "black", background: "white" });

export { dark, light };
