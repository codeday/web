import { debug } from "@codeday/utils";
import Head from "next/head";
import Script from "next/script";
import { createContext, useContext, useState, useEffect, useReducer, ReactNode } from "react";

const DEBUG = debug(["topo", "Theme", "providers", "Cmp"]);

interface CmpContextType {
  isCmpLoaded: boolean;
  isConsentRequired: boolean;
  withConsent: (provider: string, callback: () => void) => void;
  uc: any;
  ucUi: any;
}

const CmpContext = createContext<CmpContextType>({
  isCmpLoaded: false,
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
  const [isConsentRequired, setIsConsentRequired] = useState(true);
  const [uc, setUc] = useState<any>(undefined);
  const [ucUi, setUcUi] = useState<any>(undefined);

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

  const withConsent = (provider: string, callback: () => void) => {
    if (isConsentRequired) {
      DEBUG("withConsent: consent required, adding to awaitingConsent for", provider);
      setAwaitingConsent({ type: "add", provider, callback });
    } else if (uc.getStatus(provider)) {
      callback();
    }
  };

  return (
    <CmpContext.Provider value={{ isCmpLoaded, isConsentRequired, withConsent, uc, ucUi }}>
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
      <Script src="https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js" />
      <Script
        id="usercentrics-cmp"
        src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
        data-settings-id={usercentricsSettingsId || "FQ314iLcg1whiu"}
        strategy="beforeInteractive"
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
