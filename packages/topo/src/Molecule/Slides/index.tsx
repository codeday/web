import { type ComponentWithAs } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { useEffect, useReducer } from "react";

interface SlidesProps extends BoxProps {
  duration?: number;
}

const Slides: ComponentWithAs<"div", SlidesProps> = (({ duration = 15, transitionDuration = 1, children, ref, ...props }: any) => {
    const [visibleIndex, nextSlide] = useReducer(
      (lastIndex: number) => (lastIndex + 1) % React.Children.count(children),
      0,
    );

    useEffect(() => {
      const interval = setInterval(nextSlide, duration * 1000);
      return () => clearInterval(interval);
    }, [duration]);

    return (
      <Box position="relative" overflow="hidden" {...(props as any)} ref={ref as any}>
        {React.Children.map(children, (child, index) => (
          <Box
            key={(child as React.ReactElement<any>).key || index}
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            transition={`all ${transitionDuration || 1}s ease-in-out`}
            style={{ opacity: index === visibleIndex ? 1 : 0 }}
            aria-hidden={index !== visibleIndex}
          >
            {child}
          </Box>
        ))}
      </Box>
    );
}) as ComponentWithAs<"div", SlidesProps>;
Slides.displayName = "Slides";
export { Slides, type SlidesProps };
