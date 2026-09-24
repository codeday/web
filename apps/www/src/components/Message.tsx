import { GradientText, Highlight, Text } from "@codeday/topo/Atom";
import { Link } from "@codeday/topo/Next/Atom";
import { type GradientName } from "@codeday/topo/Theme";
import {
  ParaglideMessage,
  type MarkupRenderer,
  type MessagePart,
} from "@inlang/paraglide-js-react";

type AnyMessage = ((inputs?: any, options?: any) => string) & {
  parts?: (inputs?: any, options?: any) => MessagePart[];
};

export const defaultMarkup: Record<string, MarkupRenderer<any>> = {
  link: ({ children, options }) => <Link href={(options.to as string) ?? "#"}>{children}</Link>,
  b: ({ children }) => (
    <Text as="strong" bold>
      {children}
    </Text>
  ),
  highlight: ({ children }) => <Highlight>{children}</Highlight>,
  gradient: ({ children, attributes }) => (
    <GradientText ramp={(attributes.ramp as GradientName) ?? "hibiscus"}>{children}</GradientText>
  ),
  br: () => <br />,
  p: ({ children }) => (
    <Text as="p" mt="3" _first={{ mt: 0 }}>
      {children}
    </Text>
  ),
};

export function Message({
  message,
  inputs,
  options,
  markup,
}: {
  message: AnyMessage;
  inputs?: Record<string, unknown>;
  options?: Record<string, unknown>;
  markup?: Record<string, MarkupRenderer<any>>;
}) {
  return (
    <ParaglideMessage
      message={message as any}
      inputs={inputs as any}
      options={options as any}
      markup={{ ...defaultMarkup, ...markup }}
    />
  );
}
