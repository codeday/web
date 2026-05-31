import { Box } from "@codeday/topo/Atom";
/* eslint-disable no-undef */
import React, { useRef, useState, useLayoutEffect, ReactNode } from "react";

export function OnlyVisibleBox({
  children,
  ...props
}: {
  children: ReactNode;
  [key: string]: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const onResize = () =>
    setIsVisible((ref.current?.offsetWidth ?? 0) > 0 || (ref.current?.offsetHeight ?? 0) > 0);
  useLayoutEffect(() => {
    if (typeof window === "undefined") return () => {};

    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [ref, typeof window]);

  return (
    <Box {...props} ref={ref}>
      {isVisible && children}
    </Box>
  );
}
