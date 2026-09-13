import { Toast, Toaster as ChakraToaster, type createToaster } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { Box } from "../Box";

export interface ToasterProps {
  toaster: ReturnType<typeof createToaster>;
}

// .spec.md §7 commit 5b — restyles `useToasts`' toaster. `_toaster`/
// `useToasts` (utils.ts) already existed, but nothing ever mounted a
// `<Toaster>` to render them — toasts silently never appeared. This
// component is that missing render target; the consuming app mounts it
// once near the root with `<Toaster toaster={_toaster} />`.
//
// `_toaster` is a real Ark toast store on the client but a `{create(){}}`
// stub on the server (utils.ts's own SSR guard, since Ark's toast machine
// needs `window`) — rendering the real `<Toaster>` against that stub
// crashes. Mount-gated (not a bare `typeof window` check) so the server
// and the client's first render both render nothing, avoiding a hydration
// mismatch; the real toaster mounts just after.
export const Toaster = ({ toaster }: ToasterProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
      {(toast: any) => (
        <Toast.Root width={{ md: "sm" }}>
          <Toast.Indicator />
          <Box flex="1">
            <Toast.Title>{toast.title}</Toast.Title>
            {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
          </Box>
          {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
          <Toast.CloseTrigger />
        </Toast.Root>
      )}
    </ChakraToaster>
  );
};
Toaster.displayName = "Toaster";
