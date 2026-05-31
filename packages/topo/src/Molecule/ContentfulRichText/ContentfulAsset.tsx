import { Box, Image } from "@codeday/topo/Atom";
import React from "react";

const MEDIA_TYPE_VIDEO = ["video/mp4", "video/mov"];
const MEDIA_TYPE_IMAGE = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

function ContentfulAsset({ id, links, ...props }: any) {
  const asset = links?.assets?.block?.filter((l: any) => l.sys.id === id)[0];
  if (!asset) return <></>;

  if (MEDIA_TYPE_VIDEO.includes(asset.contentType)) {
    return (
      <Box {...props}>
        <video src={asset.url} controls={true} preload="auto" />
      </Box>
    );
  }

  if (MEDIA_TYPE_IMAGE.includes(asset.contentType)) {
    return <Image src={`${asset.url}?w=600`} alt="" {...props} />;
  }

  return null;
}

export { ContentfulAsset };
