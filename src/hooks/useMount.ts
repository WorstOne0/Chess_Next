"use client";

// Next
import { useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const useMount = (mountFunction: Function) => {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      mountFunction();
      firstRender.current = false;
    }
  }, []);
};
