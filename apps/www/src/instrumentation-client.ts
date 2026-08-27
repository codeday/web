import { initBotId } from "botid/client/core";
import posthog from "posthog-js";

initBotId({
  protect: [
    {
      path: "/api/applyAsVolunteer",
      method: "POST",
    },
  ],
});

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_PROXY || process.env.NEXT_PUBLIC_POSTHOG_HOST,
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: "2026-01-30",
  opt_out_capturing_by_default: true,
  cookieless_mode: "on_reject",
});
