import { debug } from "@codeday/utils";
import Head from "next/head";
import Script from "next/script";
import { createContext, useContext, useState, useEffect, useReducer, useRef, ReactNode } from "react";

const DEBUG = debug(["topo", "Theme", "providers", "Cmp"]);

// If the CMP hasn't loaded within this window, assume it's blocked (e.g. by an ad blocker).
const CMP_BLOCKED_TIMEOUT_MS = 8000;

interface CmpContextType {
  isCmpLoaded: boolean;
  isCmpBlocked: boolean;
  isConsentRequired: boolean;
  withConsent: (provider: string, callback: () => void) => void;
  uc: any;
  ucUi: any;
}

const CmpContext = createContext<CmpContextType>({
  isCmpLoaded: false,
  isCmpBlocked: false,
  isConsentRequired: true,
  withConsent: () => {
    DEBUG("!!! CMP context not yet loaded.");
  },
  uc: undefined,
  ucUi: undefined,
});

interface AwaitingConsentState {
  [provider: string]: (() => void)[];
}

type AwaitingConsentAction =
  | { type: "add"; provider: string; callback: () => void }
  | { type: "remove"; provider: string }
  | { type: "clear" };

export function CmpProvider({ children, usercentricsSettingsId }: { children: ReactNode; usercentricsSettingsId?: string }) {
  const [isCmpLoaded, setIsCmpLoaded] = useState(false);
  const [isCmpBlocked, setIsCmpBlocked] = useState(false);
  const [isConsentRequired, setIsConsentRequired] = useState(true);
  const [uc, setUc] = useState<any>(undefined);
  const [ucUi, setUcUi] = useState<any>(undefined);

  const isCmpLoadedRef = useRef(isCmpLoaded);
  useEffect(() => {
    isCmpLoadedRef.current = isCmpLoaded;
  }, [isCmpLoaded]);

  // Fallback for blocking methods that don't fire a script `error` event (e.g. silent stubs):
  // if the CMP hasn't finished loading after a generous timeout, assume it's blocked.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isCmpLoadedRef.current) {
        DEBUG("CMP did not load within timeout, assuming blocked and granting consent.");
        setIsCmpBlocked(true);
      }
    }, CMP_BLOCKED_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, []);

  const [awaitingConsent, setAwaitingConsent] = useReducer(
    (state: AwaitingConsentState, action: AwaitingConsentAction): AwaitingConsentState => {
      if (action.type === "add") {
        return {
          ...state,
          [action.provider]: [...(state[action.provider] || []), action.callback],
        };
      }
      if (action.type === "remove") {
        return Object.fromEntries(Object.entries(state).filter(([key]) => key !== action.provider));
      }
      if (action.type === "clear") {
        return {};
      }
      return state;
    },
    {},
  );

  useEffect(() => {
    if (isCmpLoaded) {
      DEBUG("CMP loaded.");
      (window as any).uc.setCustomTranslations(
        "https://termageddon.ams3.cdn.digitaloceanspaces.com/translations/",
      );
      DEBUG("Custom translations set.");
      setUc((window as any).uc);
      DEBUG("UC set to", (window as any).uc);
      setUcUi((window as any).UC_UI);
      DEBUG("UC_UI set to", (window as any).UC_UI);
    }
  }, [isCmpLoaded]);

  useEffect(() => {
    if (!isCmpLoaded || !isConsentRequired || !ucUi) return;
    const consentInterval = setInterval(() => {
      setIsConsentRequired(ucUi.isConsentRequired());
    }, 1000);
    return () => clearInterval(consentInterval);
  }, [isCmpLoaded, isConsentRequired, ucUi]);

  const checkConsent = (provider: string) => {
    if (isCmpBlocked) return true; // CMP is blocked, assume consent is granted.
    return (
      (ucUi.getServicesBaseInfo() || []).filter((s: any) => s.id === provider && s.consent.status)
        .length > 0
    );
  };

  useEffect(() => {
    if (!isConsentRequired) {
      DEBUG("isConsentRequired changed to false, executing callbacks:", awaitingConsent);
      Object.entries(awaitingConsent).forEach(([provider, callbacks]) => {
        if (checkConsent(provider)) {
          callbacks.forEach((callback) => callback());
        }
      });
      setAwaitingConsent({ type: "clear" });
    }
  }, [isConsentRequired]);

  useEffect(() => {
    if (isCmpBlocked) {
      DEBUG("CMP blocked, executing all awaiting callbacks assuming consent:", awaitingConsent);
      Object.values(awaitingConsent).forEach((callbacks) => callbacks.forEach((callback) => callback()));
      setAwaitingConsent({ type: "clear" });
    }
  }, [isCmpBlocked]);

  const withConsent = (provider: string, callback: () => void) => {
    if (isCmpBlocked) {
      DEBUG("withConsent: CMP is blocked, assuming consent for", provider);
      callback();
    } else if (isConsentRequired) {
      DEBUG("withConsent: consent required, adding to awaitingConsent for", provider);
      setAwaitingConsent({ type: "add", provider, callback });
    } else if (checkConsent(provider)) {
      callback();
    }
  };

  return (
    <CmpContext.Provider value={{ isCmpLoaded, isCmpBlocked, isConsentRequired, withConsent, uc, ucUi }}>
      <Head>
        <link rel="preconnect" href="https://privacy-proxy.usercentrics.eu" />
        <link
          rel="preload"
          href="https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js"
          as="script"
        />
        <link
          rel="preload"
          href="https://app.usercentrics.eu/browser-ui/latest/loader.js"
          as="script"
        />
      </Head>
      <Script
        src="https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js"
        onError={() => {
          DEBUG("uc-block.bundle.js failed to load, likely blocked. Assuming consent.");
          setIsCmpBlocked(true);
        }}
      />
      <Script
        id="usercentrics-cmp"
        src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
        data-settings-id={usercentricsSettingsId || "FQ314iLcg1whiu"}
        strategy="beforeInteractive"
        onError={() => {
          DEBUG("loader.js failed to load, likely blocked. Assuming consent.");
          setIsCmpBlocked(true);
        }}
        onReady={() => {
          const checkCmpLoaded = () =>
            typeof (window as any)?.uc !== "undefined" && (window as any).uc.isCMPLoaded;

          if (checkCmpLoaded()) {
            setIsCmpLoaded(true);
          } else {
            DEBUG("CMP not loaded, waiting for UC_UI_INITIALIZED...");
            window.addEventListener(
              "UC_UI_INITIALIZED",
              () => {
                const checkLoadedTask = setInterval(() => {
                  if (checkCmpLoaded()) {
                    setIsCmpLoaded(true);
                    clearInterval(checkLoadedTask);
                  }
                }, 200);
              },
              { once: true },
            );
          }
        }}
      />
      {children}
    </CmpContext.Provider>
  );
}

export function useCmp(): CmpContextType {
  return useContext(CmpContext);
}
