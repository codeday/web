import { type ComponentWithAs } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import { useSsr } from "@codeday/topo/utils";
import React, { useState, useImperativeHandle, useLayoutEffect, useRef } from "react";

export interface RatioBoxProps extends BoxProps {
  auto?: "w" | "h";
  autoDefault?: string;
}

const RatioBoxInner = (
  { w, h, auto = "h", autoDefault = "100%", children, ref: forwardedRef, ...props }: RatioBoxProps & { ref?: React.Ref<HTMLDivElement> },
) => {
    const ref = useRef(null);
    const [computed, setComputed] = useState<number | string>(autoDefault);

    useImperativeHandle(forwardedRef, () => ref.current);

    useLayoutEffect(() => {
      if (typeof window === "undefined" || !ref.current) return () => {};

      const refreshSize = () => {
        if (auto === "h") {
          setComputed(
            Math.floor(
              ((ref as React.MutableRefObject<any>).current.clientWidth / (w as number)) *
                (h as number),
            ),
          );
        } else if (auto === "w") {
          setComputed(
            Math.floor((ref as React.MutableRefObject<any>).current.clientHeight / (h as number)) *
              (w as number),
          );
        }
      };

      refreshSize();
      window.addEventListener("resize", refreshSize);
      return () => window.removeEventListener("resize", refreshSize);
    }, [w, h, auto, ref.current, typeof window]);

    return (
      <Box
        {...props}
        ref={ref}
        width={auto === "w" ? computed : "100%"}
        height={auto === "h" ? computed : "100%"}
      >
        {children}
      </Box>
    );
  };

export const RatioBox: ComponentWithAs<"div", RatioBoxProps> = (({ auto = "h", autoDefault = "100%", children, ref, ...props }: any) => {
  const ssr = useSsr();
  if (ssr) {
    return (
      <Box
        {...props}
        ref={ref as any}
        width={auto === "w" ? autoDefault : "100%"}
        height={auto === "h" ? autoDefault : "100%"}
      >
        {children}
      </Box>
    );
  }

  return (
    <RatioBoxInner {...props} auto={auto} ref={ref}>
      {children}
    </RatioBoxInner>
  );
}) as ComponentWithAs<"div", RatioBoxProps>;
