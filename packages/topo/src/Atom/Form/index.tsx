// .spec.md §4.4/§7 — exports the v3 `Field` compound directly, dropping the
// v2-named FormControl/FormLabel/FormErrorMessage/FormHelperText aliases
// (zero call sites in apps/www or packages/topo — nothing else to migrate).
// The defaults those wrappers applied via inline props now live in the
// `field` slot recipe (`../../Theme/vars/recipes/field.ts`).
//
// `Field` here means the form wrapper, following Chakra — the visual
// primitive at `../GradientField` is intentionally not named `Field`.
export { Field } from "@chakra-ui/react";
