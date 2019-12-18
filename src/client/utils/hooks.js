// react hooks
import { useState, useCallback, useEffect } from "react";
// 3rd party hooks
import hotkeys, { HotkeysEvent } from "hotkeys-js";

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

/**
 * https://usehooks.com/useOnClickOutside/
 * @param {*} ref
 * @param {*} handler
 */
const useOnClickOutside = (ref, handler) => {
  useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
};

const useHotkeys = (keys, callback, deps = []) => {
  const memoisedCallback = useCallback(callback, deps);

  useEffect(() => {
    hotkeys.filter = event => {
      // Allow hotkeys on input, select, textarea, and isContentEditable
      return true;
    };
    hotkeys(keys, memoisedCallback);

    return () => hotkeys.unbind(keys);
  }, [memoisedCallback]);
};

export { useOnKeyPress, useWindowSize, useOnClickOutside, useHotkeys };
