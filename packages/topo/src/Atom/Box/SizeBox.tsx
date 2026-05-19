import { debounce, type ComponentWithAs } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
/* eslint-disable no-undef */
import React, { useRef, useEffect, useState, useMemo } from "react";

export interface SizeBoxProps extends BoxProps {
  onWidthChanged?: (width: any) => void;
  onHeightChanged?: (height: any) => void;
  onSizeChanged?: (width: any, height: any) => void;
}

export const SizeBox: ComponentWithAs<"div", SizeBoxProps> = ((
  { onWidthChanged = () => {}, onHeightChanged = () => {}, onSizeChanged = () => {}, ref, ...props }: SizeBoxProps & { ref?: React.Ref<HTMLDivElement> },
) => {
    const boxRef: React.MutableRefObject<any> = useRef(null);
    const [lastWidth, setLastWidth] = useState<number>();
    const [lastHeight, setLastHeight] = useState<number>();

    const changeSize = () => {
      if (!boxRef.current) return;
      const { offsetWidth: width, offsetHeight: height } = boxRef.current;
      if (lastWidth !== width) {
        (onWidthChanged as any)(width);
        (onSizeChanged as any)(width, height);
        setLastWidth(width);
        setLastHeight(height);
      } else if (lastHeight !== height) {
        (onHeightChanged as any)(height);
        (onSizeChanged as any)(width, height);
        setLastWidth(width);
        setLastHeight(height);
      }
    };
    const windowChangeSize = debounce(() => changeSize(), 200, false);

    useEffect(() => {
      changeSize();
    }, [ref, typeof window]);

    useEffect(() => {
      window.addEventListener("resize", windowChangeSize as any, false);
      return () => window.removeEventListener("resize", windowChangeSize as any);
    }, []);

    return useMemo(() => <Box ref={boxRef} {...props} />, [props]);
}) as ComponentWithAs<"div", SizeBoxProps>;
