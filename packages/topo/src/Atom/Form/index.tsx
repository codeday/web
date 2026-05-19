import { Field } from "@chakra-ui/react";
import { type ComponentWithAs } from "@codeday/topo/_utils";
import React from "react";

type FormControlProps = React.ComponentPropsWithRef<typeof Field.Root>;
type FormLabelProps = React.ComponentPropsWithRef<typeof Field.Label>;

const ComposedFormControl: ComponentWithAs<"div", FormControlProps> = (({ ref, ...props }: any) => (
  <Field.Root marginBottom={4} marginTop={4} ref={ref as any} {...props} />
)) as ComponentWithAs<"div", FormControlProps>;

const ComposedFormLabel: ComponentWithAs<"label", FormLabelProps> = (({ ref, ...props }: any) =>
  <Field.Label fontWeight={600} ref={ref as any} {...props} />
) as ComponentWithAs<"label", FormLabelProps>;

export { ComposedFormControl as FormControl, ComposedFormLabel as FormLabel };
export const FormErrorMessage = Field.ErrorText;
export const FormHelperText = Field.HelperText;
