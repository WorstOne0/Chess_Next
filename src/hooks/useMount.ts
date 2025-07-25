"use client";

// Next
import { useEffect, useRef } from "react";

export const useMount = (mountFunction: Function) => {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      mountFunction();
      firstRender.current = false;
    }
  }, []);
};
