// Exports the v3 `Field` compound directly, dropping the
// v2-named FormControl/FormLabel/FormErrorMessage/FormHelperText aliases
// (zero call sites in apps/www or packages/topo — nothing else to migrate).
// The defaults those wrappers applied via inline props now live in the
// `field` slot recipe (`../../Theme/vars/recipes/field.ts`).
//
// `Field` here means the form wrapper, following Chakra — the visual
// primitive at `../Wash` is a different thing entirely (a gradient/tint
// field), not named `Field` to avoid exactly this collision.
export { Field } from "@chakra-ui/react";
