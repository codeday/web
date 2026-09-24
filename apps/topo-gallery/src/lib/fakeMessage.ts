import type { Message } from "@codeday/topo/utils";

export const fakeMessage = (value: string): Message => value as unknown as Message;
