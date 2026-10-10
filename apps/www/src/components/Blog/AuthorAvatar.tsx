import { Avatar } from "@codeday/topo/Atom";
import React from "react";

import type { BlogAuthor } from "@/lib/blog/types";

export interface AuthorAvatarProps extends React.ComponentProps<typeof Avatar.Root> {
  author: BlogAuthor;
}

export default function AuthorAvatar({ author, ...props }: AuthorAvatarProps) {
  return (
    <Avatar.Root
      flexShrink={0}
      backgroundImage="linear-gradient(110deg, {colors.hibiscus.gradient.button})"
      color="trueWhite"
      {...props}
    >
      <Avatar.Fallback name={author.name} color="trueWhite" />
      {author.picture && <Avatar.Image src={author.picture} alt="" />}
    </Avatar.Root>
  );
}
