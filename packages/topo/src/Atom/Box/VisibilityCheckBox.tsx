import { type ComponentWithAs } from "@codeday/topo/_utils";
import { Box, type BoxProps, ClientSideOnlyBox } from "@codeday/topo/Atom";
/* eslint-disable no-undef */
import React, { useRef, useState, useLayoutEffect, useImperativeHandle } from "react";

const VisibilityCheckBoxInner = (
  { children, ref: forwardedRef, ...props }: BoxProps & { ref?: React.Ref<HTMLDivElement> },
) => {
    const ref: React.MutableRefObject<any> = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useImperativeHandle(forwardedRef, () => ref.current);

    const onResize = () =>
      setIsVisible(ref.current.offsetWidth > 0 || ref.current.offsetHeight > 0);
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
  };

export const VisibilityCheckBox: ComponentWithAs<"div", BoxProps> = (({ children, ref, ...props }: any) => {
  return (
    <ClientSideOnlyBox>
      <VisibilityCheckBoxInner ref={ref} {...props}>
        {children}
      </VisibilityCheckBoxInner>
    </ClientSideOnlyBox>
  );
}) as ComponentWithAs<"div", BoxProps>;
