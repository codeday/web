import type { Message } from "@codeday/topo/utils";

// `Message` is a branded type — only `@codeday/i18n`'s `m.xxx()` message
// functions produce a real one, by design, so a raw string literal can't be
// passed to a `Message`-typed prop in real app code. Storybook stories have
// no message catalogue to call into and only ever show placeholder copy, so
// this cast is the one sanctioned place to bypass the brand — real
// components and pages must never do this themselves.
export const fakeMessage = (value: string): Message => value as unknown as Message;
