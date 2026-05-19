import { pureRef, type ComponentWithAs } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import { Text } from "@codeday/topo/Atom";
import { useColorModeValue } from "@codeday/topo/Theme";
import React from "react";
import { withProps } from "recompose";

import {
  Codeday as CodeDayLogo,
  Labs as LabsLogo,
  Csfest as CsfestLogo,
  Clear as ClearLogo,
  Community as CommunityLogo,
  Evangelist as EvangelistLogo,
  ClearText,
  Codecup as CodecupLogo,
  CodecupText as CodeCupText,
  CodedayText as CodeDayText,
  CommunityText,
  CsfestText,
  EvangelistText,
  LabsText,
} from "./Icons";
import * as Icons from "./Icons";

const upperFirst = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

interface LockupProps extends BoxProps {
  text: React.ReactNode;
  logo: React.ReactNode;
  logoColor?: string;
  textColor?: string;
}

export interface LogoProps extends BoxProps {
  text?: string;
  withText?: true;
}

const Lockup = ({ logo, text, textColor, color, ...props }: LockupProps) => (
  <Box display="inline" textDecoration="none" {...(props as any)}>
    <Box color="brand" height="1.1em" display="inline">
      {logo}
    </Box>
    <Box
      color={textColor || color || useColorModeValue("black", "white")}
      height="1em"
      display="inline"
    >
      {text}
    </Box>
  </Box>
);
Lockup.displayName = "Lockup";

export const Logo: ComponentWithAs<"div", any> = pureRef<any, "div">(
  ({ program, withText, text, ref, ...props }: any) => {
    const logoPart = React.createElement((Icons as any)[`${upperFirst(program)}`], {
      display: "inline",
      width: "auto",
      height: "1.1em",
      as: "svg",
    });
    let textPart = <></>;
    if (typeof text === "string") {
      textPart = (
        <Text
          display="inline"
          fontSize="0.94em"
          fontWeight="bold"
          fontFamily="logo"
          letterSpacing="tight"
          verticalAlign="middle"
          paddingLeft="2"
          position="relative"
          top="-0.05em"
        >
          {text}
        </Text>
      );
    } else if (withText) {
      textPart = React.createElement((Icons as any)[`${upperFirst(program)}Text`], {
        display: "inline",
        width: "auto",
        height: "1.1em",
        as: "svg",
      });
    }

    return <Lockup logo={logoPart} text={textPart} {...props} ref={ref as any} />;
  },
) as ComponentWithAs<"div", any>;
Logo.displayName = "Logo";

export const StaticLogo: ComponentWithAs<"div", any> = pureRef<any, "div">(
  ({ logoPart, textPart, withText, text, ref, ...props }: any) => {
    const logoComponent = React.createElement(logoPart, {
      display: "inline",
      width: "auto",
      height: "1.1em",
      as: "svg",
    });
    let textComponent = <></>;
    if (typeof text === "string") {
      textComponent = (
        <Text
          display="inline"
          fontSize="0.94em"
          fontWeight="bold"
          fontFamily="logo"
          letterSpacing="tight"
          verticalAlign="middle"
          paddingLeft="2"
          position="relative"
          top="-0.05em"
        >
          {text}
        </Text>
      );
    } else if (withText) {
      textComponent = React.createElement(textPart, {
        as: "svg",
        height: "1.1em",
        display: "inline",
        width: "auto",
      });
    }

    return <Lockup logo={logoComponent} text={textComponent} {...props} ref={ref as any} />;
  },
) as ComponentWithAs<"div", any>;
StaticLogo.displayName = "Logo";

export const CodeDay = withProps<any, LogoProps>({
  logoPart: CodeDayLogo,
  textPart: CodeDayText,
  program: "codeday",
  "aria-label": "CodeDay",
})(StaticLogo);

export const Labs = withProps<any, LogoProps>({
  logoPart: LabsLogo,
  textPart: LabsText,
  program: "labs",
  "aria-label": "CodeDay Labs",
})(StaticLogo);

export const CsFest = withProps<any, LogoProps>({
  logoPart: CsfestLogo,
  textPart: CsfestText,
  program: "csfest",
  "aria-label": "CodeDay CS Fest",
})(StaticLogo);

export const Evangelist = withProps<any, LogoProps>({
  logoPart: EvangelistLogo,
  textPart: EvangelistText,
  program: "evangelist",
  "aria-label": "Code Evangelist",
})(StaticLogo);

export const Clear = withProps<any, LogoProps>({
  logoPart: ClearLogo,
  textPart: ClearText,
  program: "clear",
  "aria-label": "Clear",
})(StaticLogo);

export const CodeCup = withProps<any, LogoProps>({
  logoPart: CodecupLogo,
  textPart: CodeCupText,
  program: "codecup",
  "aria-label": "CodeCup",
})(StaticLogo);

export const Community = withProps<any, LogoProps>({
  logoPart: CommunityLogo,
  textPart: CommunityText,
  program: "community",
  "aria-label": "Community",
})(StaticLogo);
