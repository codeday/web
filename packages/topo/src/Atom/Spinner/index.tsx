import React from "react";

const smilSupport = () =>
  typeof window === "undefined"
    ? true
    : // eslint-disable-next-line no-undef,no-base-to-string
      window.document
        .createElementNS("http://www.w3.org/2000/svg", "animate")
        .toString()
        .indexOf("SVG") > -1;

export const Spinner = ({ ref }: { ref?: React.Ref<HTMLImageElement> } = {}) => (
  <img
    ref={ref as React.MutableRefObject<any>}
    src={`https://f1.codeday.org/topo/loading.${smilSupport() ? "svg" : "gif"}`}
    alt="(loading...)"
    style={{ display: "inline-block" }}
  />
);
