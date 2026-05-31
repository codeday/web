import { Presence } from "@chakra-ui/react";
import { Box, Button } from "@codeday/topo/Atom";
import * as m from "@codeday/i18n/messages";
import React from "react";

const FUNDRAISE_UP_BUTTON_ID = "XBSBRRMF";

interface NavMenuProps {
  isFundraiseLoaded: boolean;
}

export default function NavMenu({ isFundraiseLoaded }: NavMenuProps) {
  return (
    <>
      <Button
        as="a"
        fontSize="md"
        fontWeight="600"
        variant="ghost"
        mr={2}
        {...({ href: "/contact" } as any)}
      >
        {m.www_navmenu_contact()}
      </Button>
      <Button
        as="a"
        fontSize="md"
        fontWeight="600"
        variant="ghost"
        mr={2}
        {...({ href: "/volunteer" } as any)}
      >
        {m.www_navmenu_volunteer()}
      </Button>
      <Button
        as="a"
        fontSize="md"
        fontWeight="600"
        variant="ghost"
        mr={2}
        {...({ href: "/press" } as any)}
      >
        {m.www_navmenu_press()}
      </Button>

      <Box mt={-4} display="inline-block" minW="129px" maxH="48px">
        <Presence
          present={isFundraiseLoaded}
          animationName={{ _open: "fade-in", _closed: "fade-out" }}
        >
          <Box>
            <a {...({ href: `#${FUNDRAISE_UP_BUTTON_ID}` } as any)} />
          </Box>
        </Presence>
      </Box>
    </>
  );
}
