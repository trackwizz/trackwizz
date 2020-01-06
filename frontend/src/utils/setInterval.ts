import { useEffect, useRef } from "react";

type func = () => void;

const useInterval = (callback: func, delay: number): void => {
  const savedCallback = useRef<func>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      if (savedCallback.current !== undefined) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return (): void => clearInterval(id);
    }
    return (): void => {};
  }, [delay]);
};

export default useInterval;
