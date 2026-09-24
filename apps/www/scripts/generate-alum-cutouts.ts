/**
 * Finds every Alum entry in Contentful without a `photoCutout`, denoises +
 * upscales its `photo` via Leonardo.Ai's Pro Upscaler, removes the
 * background from the result, trims the transparent padding, and uploads
 * the cutout as a new Asset linked + published as that entry's
 * `photoCutout`.
 *
 * One-off/manual dev tool — run with:
 *   pnpm --filter @codeday/www cutouts:alum
 *
 * Requires CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT,
 * CONTENTFUL_MANAGEMENT_TOKEN, and LEONARDO_AI_API_KEY in apps/www/.env.
 * Get a Leonardo.Ai API key from https://app.leonardo.ai (API Access page).
 */
import { createClient } from "contentful-management";
import type { AssetProps, EntryProps } from "contentful-management";
import sharp from "sharp";

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_MANAGEMENT_TOKEN,
  LEONARDO_AI_API_KEY,
} = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN || !LEONARDO_AI_API_KEY) {
  console.error(
    "Missing required env vars. Need CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN, and LEONARDO_AI_API_KEY " +
      "(get one at https://app.leonardo.ai, API Access page) set in apps/www/.env.",
  );
  process.exit(1);
}

const spaceId = CONTENTFUL_SPACE_ID;
const environmentId = CONTENTFUL_ENVIRONMENT || "master";
const locale = "en-US";

const client = createClient({ accessToken: CONTENTFUL_MANAGEMENT_TOKEN });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function denoiseAndUpscale(imageBuffer: Buffer): Promise<Buffer> {
  const { width, height } = await sharp(imageBuffer).metadata();
  if (!width || !height) {
    throw new Error("Could not read source photo dimensions");
  }

  const createRes = await fetch("https://cloud.leonardo.ai/api/rest/v2/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LEONARDO_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "aurora-upscaler-precise",
      public: false,
      parameters: {
        width,
        height,
        upscale_factor: 2,
        upscale_mode: "clean",
        guidances: {
          image_reference: [{ image: { type: "BASE64", data: imageBuffer.toString("base64") } }],
        },
      },
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Leonardo upscale API error ${createRes.status}: ${await createRes.text()}`);
  }

  const createJson = await createRes.json();
  const generationId = createJson?.generate?.generationId;
  if (!generationId) {
    throw new Error(`Leonardo upscale API returned no generationId: ${JSON.stringify(createJson)}`);
  }

  let resultUrl: string | undefined;
  for (let attempt = 0; attempt < 40; attempt++) {
    await sleep(3000);
    const pollRes = await fetch(
      `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
      {
        headers: { Authorization: `Bearer ${LEONARDO_AI_API_KEY}` },
      },
    );
    if (!pollRes.ok) {
      throw new Error(`Leonardo upscale poll error ${pollRes.status}: ${await pollRes.text()}`);
    }
    const generation = (await pollRes.json())?.generations_by_pk;
    if (generation?.status === "FAILED") {
      throw new Error(`Leonardo upscale generation ${generationId} failed`);
    }
    if (generation?.status === "COMPLETE") {
      resultUrl = generation.generated_images?.[0]?.generated_image_variation_generics?.[0]?.url;
      break;
    }
  }

  if (!resultUrl) {
    throw new Error(`Leonardo upscale generation ${generationId} did not complete in time`);
  }

  const imageRes = await fetch(resultUrl);
  if (!imageRes.ok) {
    throw new Error(`Failed to download upscaled image: ${imageRes.status}`);
  }
  return Buffer.from(await imageRes.arrayBuffer());
}

async function removeBackground(imageBuffer: Buffer): Promise<Buffer> {
  const res = await fetch("https://cloud.leonardo.ai/api/rest/v2/generationssync", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LEONARDO_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "remove-bg",
      public: false,
      base64: true,
      parameters: {
        format: "png",
        type: "person",
        guidances: {
          image_reference: [{ image: { type: "BASE64", data: imageBuffer.toString("base64") } }],
        },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Leonardo API error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  const dataB64 = json?.generateSync?.results?.[0]?.dataB64;
  if (!dataB64) {
    throw new Error(`Leonardo API returned no image data: ${JSON.stringify(json)}`);
  }
  return Buffer.from(dataB64, "base64");
}

async function fetchAssetBytes(assetId: string): Promise<Buffer> {
  const asset = await client.asset.get({ spaceId, environmentId, assetId });
  const file = asset.fields.file?.[locale];
  if (!file?.url) {
    throw new Error(`Asset ${assetId} has no processed file for locale ${locale}`);
  }
  const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download asset ${assetId}: ${res.status}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function createCutoutAsset(
  title: string,
  fileName: string,
  bytes: Buffer,
): Promise<AssetProps> {
  let asset = await client.asset.createFromFiles(
    { spaceId, environmentId },
    {
      fields: {
        title: { [locale]: title },
        description: { [locale]: "" },
        file: {
          [locale]: {
            contentType: "image/png",
            fileName,
            file: bytes.buffer.slice(
              bytes.byteOffset,
              bytes.byteOffset + bytes.byteLength,
            ) as ArrayBuffer,
          },
        },
      },
    },
  );
  asset = await client.asset.processForAllLocales({ spaceId, environmentId }, asset, {
    processingCheckWait: 1000,
    processingCheckRetries: 15,
  });
  return client.asset.publish({ spaceId, environmentId, assetId: asset.sys.id }, asset);
}

async function main() {
  const { items: entries } = await client.entry.getMany({
    spaceId,
    environmentId,
    query: { content_type: "alum", limit: 1000 },
  });

  const pending = entries.filter((entry: EntryProps) => !entry.fields.photoCutout?.[locale]);
  console.log(`${pending.length} of ${entries.length} Alum entries are missing a photoCutout.`);

  for (const entry of pending) {
    const name = entry.fields.name?.[locale] ?? entry.sys.id;
    const photo = entry.fields.photo?.[locale];
    if (!photo?.sys?.id) {
      console.warn(`- Skipping "${name}" (${entry.sys.id}): no photo set.`);
      continue;
    }

    console.log(`- Processing "${name}"...`);
    const photoBytes = await fetchAssetBytes(photo.sys.id);
    const denoisedBytes = await denoiseAndUpscale(photoBytes);
    const rawCutoutBytes = await removeBackground(denoisedBytes);
    const cutoutBytes = await sharp(rawCutoutBytes).trim().png().toBuffer();
    const cutoutAsset = await createCutoutAsset(
      `${name} (Cutout)`,
      `${photo.sys.id}-cutout.png`,
      cutoutBytes,
    );

    const updatedEntry = await client.entry.update(
      { spaceId, environmentId, entryId: entry.sys.id },
      {
        ...entry,
        fields: {
          ...entry.fields,
          photoCutout: {
            [locale]: { sys: { type: "Link", linkType: "Asset", id: cutoutAsset.sys.id } },
          },
        },
      },
    );
    await client.entry.publish({ spaceId, environmentId, entryId: entry.sys.id }, updatedEntry);
    console.log(`  done -> asset ${cutoutAsset.sys.id}`);
  }

  console.log("All done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
