import { awaitQuerySelectorAll } from "@codeday/topo/utils";
import { debug } from "@codeday/utils";
import Head from "next/head";
import Script from "next/script";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
const DEBUG = debug(["www", "providers", "Fundraise"]);
const FUNDRAISE_UP_ID = process.env.NEXT_PUBLIC_FUNDRAISE_UP_ID || "AHCSATYN";

interface FundraiseContextType {
  isFundraiseLoaded: boolean;
}

const FundraiseContext = createContext<FundraiseContextType>({
  isFundraiseLoaded: false,
});

const FUNDRAISE_UP_IFRAME_SELECTOR = `
  iframe[title="Donate Button"],
  iframe[title="Donation Form"],
  iframe[title="Donation Activity Popup"],
  .fun-social-proof-iframe,
  iframe[title="Donation Reminder"]
`;

const FUNDRAISE_UP_STYLE = `
  ${FUNDRAISE_UP_IFRAME_SELECTOR} {
    color-scheme: normal !important;
    background-color: transparent !important;
  }
`;

export function FundraiseProvider({ children }: { children: ReactNode }) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isFundraiseLoaded, setIsFundraiseLoaded] = useState(false);

  useEffect(() => {
    if (isScriptLoaded) {
      DEBUG("Fundraise script loaded.");
      void (async () => {
        await awaitQuerySelectorAll(FUNDRAISE_UP_IFRAME_SELECTOR);
        setIsFundraiseLoaded(true);
        DEBUG("Fundraise app loaded.");
      })();
    }
  }, [isScriptLoaded]);

  return (
    <FundraiseContext.Provider value={{ isFundraiseLoaded }}>
      <Head>
        <link rel="preconnect" href="https://cdn.fundraiseup.com" />
        <link rel="preload" href={`https://cdn.fundraiseup.com/widget/${FUNDRAISE_UP_ID}`} as="script" />
        <style dangerouslySetInnerHTML={{ __html: FUNDRAISE_UP_STYLE }}></style>
      </Head>
      <Script
        strategy="afterInteractive"
        src={`https://cdn.fundraiseup.com/widget/${FUNDRAISE_UP_ID}`}
        onLoad={() => setIsScriptLoaded(true)}
      />
      {children}
    </FundraiseContext.Provider>
  );
}

export function useFundraise(): FundraiseContextType {
  const fundraiseData = useContext(FundraiseContext);
  return fundraiseData;
}
