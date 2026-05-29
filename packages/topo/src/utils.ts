import { createToaster } from "@chakra-ui/react";
import { GraphQLClient } from "graphql-request";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// ThemeData context (inlined here so next.config.js require() works without
// hitting relative .ts imports that Node cannot resolve without SWC hooks)
// ---------------------------------------------------------------------------

export interface ThemeData {
  colors: Record<string, any>;
  fonts: Record<string, string>;
  fontSizes: Record<string, string>;
  space: Record<string | number, string>;
  radii: Record<string, string>;
  cognito: { id: string };
  /** @deprecated Use Paraglide messages directly instead of useString(). */
  strings: Record<string, string>;
  visibility: string;
  programWebname?: string;
  config?: Record<string, any>;
  apiEndpoint?: string;
  [key: string]: any;
}

export const defaultFontSizes: Record<string, string> = {
  "2xs": "0.625rem",
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
};

const defaultSpace: Record<string | number, string> = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
};
const defaultRadii: Record<string, string> = {
  none: "0",
  sm: "0.125rem",
  base: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

const ThemeDataContext = createContext<ThemeData>({
  colors: {},
  fonts: {},
  fontSizes: defaultFontSizes,
  space: defaultSpace,
  radii: defaultRadii,
  cognito: { id: "7hYXr3TPxk6yIpJxjqVoFQ" },
  strings: {},
  visibility: "Public",
  apiEndpoint: "https://graph.codeday.org/",
});

export const ThemeDataProvider = ThemeDataContext.Provider;
export const useThemeData = (): ThemeData => useContext(ThemeDataContext);

export { useDisclosure } from "@chakra-ui/react";
export { useThemeData as useTheme };

export function useSsr() {
  const [isSsr, setIsSsr] = useState(true);
  useEffect(() => setIsSsr(typeof window === "undefined"), [typeof window]);
  return isSsr;
}

export const api = "https://graph.codeday.org/";
export const apiFetch = (query: any, variables: any, headers?: any, endpoint?: string) => {
  const client = new GraphQLClient(endpoint || api, { headers: headers || {} });
  return client.request(query, variables);
};

/**
 * usePrefersReducedMotion - removed from Chakra UI v3, reimplemented here.
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return prefersReducedMotion;
}

// ---------------------------------------------------------------------------
// Toast system - Chakra UI v3 uses createToaster instead of useToast
// ---------------------------------------------------------------------------

export const _toaster: ReturnType<typeof createToaster> = (
  typeof window !== "undefined"
    ? createToaster({
        placement: "top-end",
        pauseOnPageIdle: true,
      })
    : { create: () => {} }
) as any;

export interface UseToastsOptions {
  success: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  addToast: (options: any) => void;
}

export function useToasts(): UseToastsOptions {
  return {
    addToast: (opts: any) => _toaster.create(opts),
    info: (title, description) => _toaster.create({ title, description, type: "info" }),
    success: (title, description) => _toaster.create({ title, description, type: "success" }),
    warning: (title, description) => _toaster.create({ title, description, type: "warning" }),
    error: (title, description) => _toaster.create({ title, description, type: "error" }),
  };
}

// ---------------------------------------------------------------------------
// Theme helpers
// ---------------------------------------------------------------------------

/**
 * @deprecated Use Paraglide message functions from `@codeday/i18n/messages` directly instead.
 */
export function useString(key: string | number, initialValue: any) {
  const { strings } = useThemeData();
  return (strings as Record<string | number, string>)[key] || initialValue;
}

// ---------------------------------------------------------------------------
// Local storage
// ---------------------------------------------------------------------------

export function useLocalStorage(key: string, initialValue: any) {
  const [hasValue, setHasValue] = useState(false);
  const [value, setValue] = useState(() =>
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem(key) as string) || initialValue
      : initialValue,
  );

  const handleStorageUpdate = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue !== value) {
        setValue(JSON.parse(event.newValue as string) || initialValue);
      }
    },
    [value],
  );

  const setItem = (newValue: any) => {
    setValue(newValue);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } else {
      setHasValue(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (hasValue) {
        setItem(value);
      } else {
        const newValue = window.localStorage.getItem(key);
        if (value !== newValue) {
          setValue(newValue || initialValue);
        }
      }
    }
  }, [typeof window]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorageUpdate);
      }
    };
  }, [handleStorageUpdate, typeof window]);

  return [value, setItem];
}

export function awaitQuerySelectorAll(selector: string): Promise<NodeListOf<Element>> {
  return new Promise((resolve) => {
    if (document.querySelectorAll(selector)) {
      return resolve(document.querySelectorAll(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelectorAll(selector).length > 0) {
        observer.disconnect();
        resolve(document.querySelectorAll(selector));
      }
    });

    // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

export function subscribeQuerySelectorAll(
  selector: string,
  callback: (elements: NodeListOf<Element>) => void,
): () => void {
  if (document.querySelectorAll(selector)) {
    callback(document.querySelectorAll(selector));
  }

  const observer = new MutationObserver(() => {
    if (document.querySelectorAll(selector).length > 0) {
      callback(document.querySelectorAll(selector));
    }
  });

  // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  return () => observer.disconnect();
}

/**
 * Creates a Next.js getStaticProps that fetches a GraphQL query and returns
 * the result as `props.query` for use with PageDataProvider / usePageData.
 *
 * @example
 * import { print } from "graphql";
 * export const getStaticProps = createStaticProps(print(MyQuery), { someVar: "value" });
 */
export function createStaticProps(
  query: string,
  variables?: Record<string, any> | (() => Record<string, any>),
  options?: {
    revalidate?: number | false;
    headers?: Record<string, string>;
    endpoint?: string;
  },
) {
  return async () => {
    const vars = typeof variables === "function" ? variables() : variables || {};
    const result = await apiFetch(query, vars, options?.headers || {}, options?.endpoint);
    return {
      props: { query: result },
      revalidate: options?.revalidate ?? 300,
    };
  };
}
