import { useState, useCallback, useEffect } from "react";

/**
 * Taken from https://wattenberger.com/blog/react-hooks
 * @param {string} targetKey
 * @param {function} onKeyDown
 * @param {function} onKeyUp
 * @param {boolean} isDebugging
 */
const useOnKeyPress = (targetKey, onKeyDown, onKeyUp, isDebugging = false) => {
  const [isKeyDown, setIsKeyDown] = useState(false);

  const onKeyDownLocal = useCallback(e => {
    if (isDebugging)
      console.log(
        "key down",
        e.key,
        e.key != targetKey ? "- isn't triggered" : "- is triggered"
      );
    if (e.key != targetKey) return;
    setIsKeyDown(true);
    if (typeof onKeyDown != "function") return;
    onKeyDown(e);
  });

  const onKeyUpLocal = useCallback(e => {
    if (isDebugging)
      console.log(
        "key up",
        e.key,
        e.key != targetKey ? "- isn't triggered" : "- is triggered"
      );
    if (e.key != targetKey) return;
    setIsKeyDown(false);
    if (typeof onKeyUp != "function") return;
    onKeyUp(e);
  });

  //* Binding
  useEffect(() => {
    addEventListener("keydown", onKeyDownLocal);
    addEventListener("keyup", onKeyUpLocal);
    return () => {
      removeEventListener("keydown", onKeyDownLocal);
      removeEventListener("keyup", onKeyUpLocal);
    };
  }, []);
  return isKeyDown;
};

const useWindowSize = () => {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};

export { useOnKeyPress, useWindowSize };
