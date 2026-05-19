import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

// ---------------------------------------------------------------------------
// Local replacements for Chakra v2-only utility types
// ---------------------------------------------------------------------------

type As = React.ElementType;

type PropsOf<T extends As> = React.ComponentPropsWithRef<T>;

type RightJoinProps<SourceProps extends object = {}, OverrideProps extends object = {}> = Omit<
  SourceProps,
  keyof OverrideProps
> &
  OverrideProps;

/**
 * A polymorphic component type (replaces the Chakra v2 `ComponentWithAs`).
 * Exported so downstream files can import it from `@codeday/topo/_utils`.
 */
export type ComponentWithAs<
  C extends As,
  Props extends object = {},
> = {
  (props: RightJoinProps<PropsOf<C>, Props> & { as?: As; ref?: React.Ref<any> }): React.ReactElement | null;
  displayName?: string;
};

// ---------------------------------------------------------------------------
// Misc utilities
// ---------------------------------------------------------------------------

export const dereferenceDottedString = (str: string, obj: any) =>
  str.split(".").reduce((o, i) => o[i], obj);

export const debounce = (
  func: { apply: (arg0: undefined, arg1: any[]) => void },
  wait: number | undefined,
  immediate: any,
) => {
  let timeout: number | undefined;
  return (...args: any[]) => {
    const context: any = undefined;
    const later = () => {
      timeout = undefined;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const reactChildrenMapRecursive = (
  children: React.ReactNode,
  fn: (child: React.ReactNode) => React.ReactNode,
): React.ReactNode =>
  React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    // @ts-ignore
    if (child.props.children) {
      return fn(
        React.cloneElement(child as React.ReactElement<any>, {
          // @ts-ignore
          children: reactChildrenMapRecursive(child.props.children, fn),
        }),
      );
    }

    return fn(child);
  });

export const setChildProps =
  (props: any, defaultProps?: any, derivedProps?: (arg0: any) => any) =>
  (child: React.ReactElement) =>
    React.cloneElement(child, {
      ...defaultProps,
      ...(child ? (child.props as object) : {}),
      ...props,
      ...(derivedProps ? derivedProps(child) : []),
    });

interface IPrototype {
  prototype: any;
}

export const wrapHtml = (nodes: React.ReactNode) =>
  (Array.isArray(nodes) ? React.Children.toArray(nodes) : [nodes]).map((e) =>
    typeof e === "string" ||
    !(e as IPrototype & React.ReactNode).prototype ||
    !(e as IPrototype & React.ReactNode).prototype.isReactComponent ? (
      <Box>{e}</Box>
    ) : (
      e
    ),
  );

// ---------------------------------------------------------------------------
// pureRef — wraps a render function as a simple component
// ---------------------------------------------------------------------------

export const pureRef = <T extends object, P extends As>(
  Component: (props: RightJoinProps<PropsOf<P>, T> & { as?: As; ref?: React.Ref<any> }, ref?: React.Ref<any>) => React.ReactElement | null,
) => {
  const Wrapped = (props: RightJoinProps<PropsOf<P>, T> & { as?: As; ref?: React.Ref<any> }) =>
    Component(props as any, props.ref);
  return Wrapped as unknown as ComponentWithAs<P, T>;
};

// ---------------------------------------------------------------------------
// makePureBox — creates a named, memoised Box-based component
// ---------------------------------------------------------------------------

export const makePureBox = (
  name: string | undefined,
  defaultProps?: BoxProps,
  Component?: typeof React.Component,
): ComponentWithAs<"div", BoxProps> => {
  const DerivedBox = pureRef<BoxProps, "div">(
    ({ children, ref, ...props }: any) => (
      <Box {...defaultProps} {...props} ref={ref}>
        {Component ? <Component>{children}</Component> : children}
      </Box>
    ),
  );

  DerivedBox.displayName = name;
  return DerivedBox as ComponentWithAs<"div", BoxProps>;
};

// ---------------------------------------------------------------------------
// childrenOfType — filter React children by component type
// ---------------------------------------------------------------------------

export const childrenOfType = (
  children: React.ReactNode,
  type: string | React.JSXElementConstructor<any>,
) => React.Children.toArray(children).filter((e) => (e as React.ReactElement<any>).type == type);
