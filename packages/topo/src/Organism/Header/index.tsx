import {
  Dialog as ChakraDialog,
  Portal,
  useBreakpointValue,
  Box,
  type BoxProps,
} from "@chakra-ui/react";
import { Button } from "@codeday/topo/Atom";
import { UiMenu, UiX, UiArrowDown } from "@codeday/topocons";
import React, { useEffect, useRef, useState } from "react";

import type { GradientName } from "../../Theme/vars/colors";
import { useGrainOverlay } from "../../Theme/vars/grain";
import { usePrefersReducedMotion } from "../../utils";

const HEADER_GRAIN_OPACITY = 0.5;

// Locks body scroll for as long as `active` is true, using `overflow:
// hidden` plus a stored scroll offset restored on release — deliberately
// NOT `position: fixed` on the body, which is a common scroll-lock
// technique but loses the scroll position on iOS Safari.
function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === "undefined") return undefined;
    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      window.scrollTo({ top: scrollY, left: 0, behavior: "instant" as ScrollBehavior });
    };
  }, [active]);
}

export interface HeaderProps extends Omit<BoxProps, "children"> {
  onWash?: boolean;
  ramp?: GradientName;
  /**
   * A `HeaderBrand`, some `HeaderLink`s, a `HeaderSpacer`, and a trailing
   * action (typically a `Button`) — the SAME children populate the desktop
   * row and the mobile menu (`Header` walks them by type to build both).
   * Pass them directly, not wrapped in an intermediate component — a
   * `<MyLinks />` that itself renders several `HeaderLink`s is one opaque
   * child of type `MyLinks` as far as `React.Children.toArray` is
   * concerned, not the `HeaderLink`s inside it, so the mobile menu would
   * come up empty. Building the link list from a data array is fine — just
   * spread it (`{links.map(l => <HeaderLink key={l.href} ... />)}`), don't
   * hand it to a wrapping function component.
   */
  children?: React.ReactNode;
}

export interface HeaderLinkItem {
  label: string;
  href?: string;
}

export interface HeaderLinkProps extends Omit<BoxProps, "children"> {
  active?: boolean;
  href?: string;
  items?: HeaderLinkItem[];
  children?: React.ReactNode;
}

export const HeaderBrand = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <Box ref={ref} boxSize="7" borderRadius="md" overflow="hidden" flexShrink={0} {...props} />
));
HeaderBrand.displayName = "HeaderBrand";

export const HeaderLink = React.forwardRef<HTMLAnchorElement, HeaderLinkProps>(
  ({ active = false, children, items: _items, ...props }, ref) => (
    <Box
      as="a"
      ref={ref}
      position="relative"
      fontSize="sm"
      fontWeight="600"
      opacity={active ? 1 : 0.82}
      whiteSpace="nowrap"
      {...props}
    >
      {children}
      {active && (
        <Box
          position="absolute"
          left="0"
          right="0"
          bottom="-2"
          height="0.5"
          borderRadius="xs"
          bg="currentColor"
        />
      )}
    </Box>
  ),
);
HeaderLink.displayName = "HeaderLink";

export const HeaderSpacer = (props: BoxProps) => <Box flex="1" {...props} />;

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <Box position="relative" boxSize="5">
      <UiMenu
        position="absolute"
        inset="0"
        boxSize="5"
        opacity={open ? 0 : 1}
        transform={open ? "rotate(90deg)" : "rotate(0)"}
        transition="opacity .18s ease-out, transform .18s ease-out"
      />
      <UiX
        position="absolute"
        inset="0"
        boxSize="5"
        opacity={open ? 1 : 0}
        transform={open ? "rotate(0)" : "rotate(-90deg)"}
        transition="opacity .18s ease-out, transform .18s ease-out"
      />
    </Box>
  );
}

function MobileMenuLink({
  item,
  index,
}: {
  item: React.ReactElement<HeaderLinkProps>;
  index: number;
}) {
  const { href, active, items, children } = item.props;
  const [expanded, setExpanded] = useState(false);
  const hasItems = !!items?.length;
  const prefersReducedMotion = usePrefersReducedMotion();

  const row = (
    <Box
      as={hasItems ? "button" : "a"}
      onClick={hasItems ? () => setExpanded((e) => !e) : undefined}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="full"
      minHeight="12"
      textAlign="start"
      background="none"
      border="none"
      cursor="pointer"
      position="relative"
      fontSize="3xl"
      fontWeight="800"
      letterSpacing="normal"
      lineHeight="shorter"
      color="trueWhite"
      opacity={active ? 1 : 0.82}
      style={{
        animationName: "topo-header-link-in",
        animationDuration: "180ms",
        animationTimingFunction: "ease-out",
        animationFillMode: "backwards",
        animationDelay: prefersReducedMotion ? "0ms" : `${index * 30}ms`,
      }}
      {...({ type: hasItems ? "button" : undefined, href: hasItems ? undefined : href } as any)}
    >
      <Box as="span">{children}</Box>
      {hasItems && (
        <UiArrowDown
          boxSize="4.5"
          flexShrink={0}
          transform={expanded ? "rotate(180deg)" : "rotate(0)"}
          transition="transform .18s ease-out"
        />
      )}
      {active && !hasItems && (
        <Box
          position="absolute"
          left="0"
          right="0"
          bottom="-0.5"
          height="0.5"
          borderRadius="xs"
          bg="currentColor"
        />
      )}
    </Box>
  );

  return (
    <Box>
      {row}
      {hasItems && expanded && (
        <Box
          display="flex"
          flexDirection="column"
          gap="3.5"
          paddingInlineStart="4"
          paddingBlockStart="3.5"
        >
          {items!.map((sub, subIndex) => (
            <Box
              as="a"
              key={subIndex}
              display="flex"
              alignItems="center"
              minHeight="12"
              fontSize="lg"
              fontWeight="600"
              color="trueWhite"
              opacity={0.82}
              {...({ href: sub.href } as any)}
            >
              {sub.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

interface HeaderMobileMenuProps {
  open: boolean;
  onClose: () => void;
  ramp: GradientName;
  brand?: React.ReactNode;
  links: React.ReactElement<HeaderLinkProps>[];
  action?: React.ReactElement<any>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  menuId: string;
}

function HeaderMobileMenu({
  open,
  onClose,
  ramp,
  brand,
  links,
  action,
  triggerRef,
  menuId,
}: HeaderMobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const bottomCloseRef = useRef<HTMLButtonElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  useBodyScrollLock(open);
  const { containerRef, canvas } = useGrainOverlay("header-mobile-menu", HEADER_GRAIN_OPACITY);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (open && !wasOpen.current) {
      const raf = requestAnimationFrame(() => closeRef.current?.focus());
      wasOpen.current = open;
      return () => cancelAnimationFrame(raf);
    }
    if (!open && wasOpen.current) {
      triggerRef.current?.focus();
    }
    wasOpen.current = open;
    return undefined;
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const mobileAction =
    action &&
    (action.type === Button
      ? React.cloneElement(action, {
          variant: "onColor",
          color: "colorPalette.true.800",
          width: "full",
          size: "lg",
        } as any)
      : action);

  return (
    <ChakraDialog.Root
      open={open}
      onOpenChange={(d: any) => {
        if (!d.open) onClose();
      }}
      preventScroll={false}
    >
      <Portal>
        <ChakraDialog.Positioner position="fixed" inset="0" zIndex="1400">
          <ChakraDialog.Content
            id={menuId}
            ref={containerRef as any}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            colorPalette={ramp}
            position="fixed"
            inset="0"
            margin="0"
            width="full"
            height="full"
            maxWidth="none"
            borderRadius="0"
            boxShadow="none"
            bg="transparent"
            display="flex"
            flexDirection="column"
            overflow="hidden"
            color="trueWhite"
            backgroundImage="linear-gradient(180deg, {colors.colorPalette.gradient.critical})"
            onTouchStart={(e) => {
              touchStartY.current = e.touches[0]?.clientY ?? null;
            }}
            onTouchMove={(e) => {
              if (touchStartY.current === null) return;
              const delta = e.touches[0].clientY - touchStartY.current;
              if (delta > 80) onClose();
            }}
            onTouchEnd={() => {
              touchStartY.current = null;
            }}
            css={{
              "@keyframes topo-header-menu-in": {
                from: { opacity: 0, transform: "translateY({spacing.3})" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
              "@keyframes topo-header-menu-out": {
                from: { opacity: 1 },
                to: { opacity: 0 },
              },
              "@keyframes topo-header-link-in": {
                from: { opacity: 0, transform: "translateY({spacing.2})" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
              "&[data-state='open']": {
                animation: "topo-header-menu-in 180ms ease-out",
              },
              "&[data-state='closed']": {
                animation: "topo-header-menu-out 120ms ease-in forwards",
              },
              "@media (prefers-reduced-motion: reduce)": {
                "@keyframes topo-header-menu-in": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
                "@keyframes topo-header-link-in": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              flexShrink={0}
              height="14"
              paddingInlineStart="calc({spacing.4} + max(0px, env(safe-area-inset-left)))"
              paddingInlineEnd="calc({spacing.4} + max(0px, env(safe-area-inset-right)))"
            >
              {brand}
              <Box flex="1" />
              <Box
                as="button"
                ref={closeRef}
                onClick={onClose}
                aria-label="Close menu"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxSize="11"
                marginInlineEnd="-3"
                background="none"
                border="none"
                cursor="pointer"
                {...({ type: "button" } as any)}
                color="trueWhite"
              >
                <MenuGlyph open />
              </Box>
            </Box>

            <Box
              as="nav"
              display="flex"
              flexDirection="column"
              gap="5"
              marginBlockStart="3"
              paddingInlineStart="calc({spacing.5} + max(0px, env(safe-area-inset-left)))"
              paddingInlineEnd="calc({spacing.5} + max(0px, env(safe-area-inset-right)))"
              overflowY="auto"
            >
              {links.map((link, index) => (
                <MobileMenuLink key={index} item={link} index={index} />
              ))}
            </Box>

            <Box flex="1" />

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="4"
              paddingInlineStart="calc({spacing.5} + max(0px, env(safe-area-inset-left)))"
              paddingInlineEnd="calc({spacing.5} + max(0px, env(safe-area-inset-right)))"
              paddingBlockEnd="calc({spacing.6} + max(0px, env(safe-area-inset-bottom)))"
            >
              {mobileAction}
              <Box
                as="button"
                ref={bottomCloseRef}
                aria-label="Close menu"
                onClick={onClose}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxSize="12"
                borderRadius="full"
                background="rgba(255,255,255,.14)"
                border="none"
                color="trueWhite"
                {...({ type: "button" } as any)}
                cursor="pointer"
              >
                <UiX boxSize="5" />
              </Box>
            </Box>

            {canvas}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  );
}

function isElementOfType(node: React.ReactNode, type: unknown): node is React.ReactElement {
  return React.isValidElement(node) && node.type === type;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ onWash = false, ramp = "hibiscus", children, ...props }, forwardedRef) => {
    const { containerRef, canvas } = useGrainOverlay("header", HEADER_GRAIN_OPACITY);
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useBreakpointValue({ base: true, md: false }) ?? true;
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuId = React.useId();

    useEffect(() => {
      if (!isMobile && mobileOpen) setMobileOpen(false);
    }, [isMobile, mobileOpen]);

    const childArray = React.Children.toArray(children);
    const brand = childArray.find((c) => isElementOfType(c, HeaderBrand));
    const links = childArray.filter((c) =>
      isElementOfType(c, HeaderLink),
    ) as React.ReactElement<HeaderLinkProps>[];
    const action = childArray.find(
      (c) =>
        !isElementOfType(c, HeaderBrand) &&
        !isElementOfType(c, HeaderLink) &&
        !isElementOfType(c, HeaderSpacer),
    ) as React.ReactElement<any> | undefined;

    return (
      <>
        <Box
          as="header"
          ref={(node: HTMLElement | null) => {
            if (onWash) containerRef(node);
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef)
              (forwardedRef as React.RefObject<HTMLElement | null>).current = node;
          }}
          display="flex"
          alignItems="center"
          gap={{ base: "3", md: "6" }}
          height={{ base: "14", md: "auto" }}
          paddingBlock={{ base: "0", md: "3.5" }}
          paddingInlineStart={{
            base: "calc({spacing.4} + max(0px, env(safe-area-inset-left)))",
            md: "4.5",
          }}
          paddingInlineEnd={{
            base: "calc({spacing.4} + max(0px, env(safe-area-inset-right)))",
            md: "4.5",
          }}
          width="full"
          border={{ base: 0, md: "4px solid {colors.current.bg}" }}
          borderRadius="xl"
          boxSizing={{ base: "border-box", md: "content-box" }}
          position="sticky"
          top="0"
          zIndex="30"
          overflow="hidden"
          colorPalette={onWash ? ramp : undefined}
          backgroundImage={
            onWash ? "linear-gradient(115deg, {colors.colorPalette.gradient.critical})" : undefined
          }
          bg={onWash ? undefined : "current.bg"}
          borderWidth={onWash ? undefined : "1px"}
          borderColor={onWash ? undefined : "current.border"}
          color={onWash ? "trueWhite" : "black"}
          {...props}
        >
          <Box display={{ base: "none", md: "flex" }} alignItems="center" gap="6" width="full">
            {children}
          </Box>

          <Box display={{ base: "flex", md: "none" }} alignItems="center" width="full">
            {brand}
            <Box flex="1" />
            <Box
              as="button"
              ref={triggerRef}
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls={menuId}
              aria-label="Open menu"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxSize="11"
              marginInlineEnd="-3"
              background="none"
              border="none"
              {...({ type: "button" } as any)}
              cursor="pointer"
              color="inherit"
            >
              <MenuGlyph open={false} />
            </Box>
          </Box>

          {onWash && canvas}
        </Box>
        {isMobile && (
          <HeaderMobileMenu
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ramp={ramp}
            brand={brand}
            links={links}
            action={action}
            triggerRef={triggerRef}
            menuId={menuId}
          />
        )}
      </>
    );
  },
);
Header.displayName = "Header";
