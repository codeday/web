import { useCmp } from "@codeday/topo/Theme";
import { debug } from "@codeday/utils";
import posthog from "posthog-js";
import { createContext, useContext, useEffect, ReactNode } from "react";
import LinkedInTag from "react-linkedin-insight";

const DEBUG = debug(["www", "providers", "Marketing"]);

interface MarketingContextType {
  linkedInConversion: (e: string) => void;
}

const MarketingContext = createContext<MarketingContextType>({
  linkedInConversion: () => {},
});

const LINKEDIN_CMP_PROVIDER = process.env.NEXT_PUBLIC_LINKEDIN_CMP_PROVIDER || "JQ2XQxIk";
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || "1831116";
const POSTHOG_CMP_PROVIDER = process.env.NEXT_PUBLIC_POSTHOG_CMP_PROVIDER || "uRoG9JxhEUtI4V";

export function MarketingProvider({ children }: { children: ReactNode }) {
  const { withConsent } = useCmp();

  useEffect(() => {
    if (typeof withConsent !== "function") return;
    posthog.opt_out_capturing();
    withConsent(LINKEDIN_CMP_PROVIDER, () => {
      LinkedInTag.init(LINKEDIN_PARTNER_ID, null, false);
    });
    withConsent(POSTHOG_CMP_PROVIDER, () => {
      DEBUG("posthog consent granted, opt in capturing");
      posthog.opt_in_capturing();
    });
  }, [typeof withConsent]);

  const linkedInConversion = (e: string) => LinkedInTag.track(e);

  return (
    <MarketingContext.Provider value={{ linkedInConversion }}>{children}</MarketingContext.Provider>
  );
}

export function useMarketing(): MarketingContextType {
  return useContext(MarketingContext);
}
