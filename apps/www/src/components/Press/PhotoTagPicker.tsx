import { Text, Box } from "@codeday/topo/Atom";
import { UiX } from "@codeday/topocons";
import React, { useState } from "react";

interface PhotoTagPickerProps {
  photos: any[];
  onChange: (tag: string | null) => void;
  [key: string]: any;
}

export default function PhotoTagPicker({ photos, onChange, ...props }: PhotoTagPickerProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const allTags: string[] = [
    ...new Set<string>(
      photos
        .map((p) => p.tags)
        .reduce((accum: string[], t: string[] | null) => [...accum, ...(t || [])], [])
        .filter((t: string) => t),
    ),
  ];

  return (
    <Box p={4} borderWidth={1} rounded="md" {...props}>
      <Text fontWeight="bold" fontSize="sm" color="current.textLight">
        Show only photos of:
      </Text>
      {allTags.map((t) => (
        <Box
          display="inline-block"
          p={2}
          mr={2}
          mb={2}
          cursor="pointer"
          borderWidth={1}
          rounded="sm"
          color={selectedTag === t ? "black" : "current.textLight"}
          borderColor={selectedTag === t ? "black" : "current.border"}
          onClick={() => {
            const newTag = selectedTag === t ? null : t;
            setSelectedTag(newTag);
            onChange(newTag);
          }}
        >
          {selectedTag === t && (
            <>
              <UiX />
              &nbsp;&nbsp;
            </>
          )}
          {t}
        </Box>
      ))}
    </Box>
  );
}
