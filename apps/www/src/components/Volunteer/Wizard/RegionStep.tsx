import {
  Box,
  Button,
  Text,
  Heading,
  TextInput,
  Divider,
  Checkbox,
  Radio,
} from "@codeday/topo/Atom";
import { Collapse } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import React from "react";

interface RegionStepProps {
  regions: any[];
  regionsByCountry: Record<string, any[]>;
  region: string;
  setRegion: (r: string) => void;
  isOrganize: boolean;
  setIsOrganize: (v: boolean) => void;
  setHasSelection: (v: boolean) => void;
  commitmentLevel: number;
  setCommitmentLevel: (v: number) => void;
}

export default function RegionStep({
  regions,
  regionsByCountry,
  region,
  setRegion,
  isOrganize,
  setIsOrganize,
  setHasSelection,
  commitmentLevel,
  setCommitmentLevel,
}: RegionStepProps) {
  return (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        {m.www_region_select_city()}
      </Heading>
      {
        // force "Other" to end of list (kind of hacky)
        [
          ...Object.keys(regionsByCountry).filter((k) => k !== "Other"),
          Object.keys(regionsByCountry).includes("Other") ? "Other" : undefined,
        ].map((regionKey) => (
          <Box>
            {/* Capitalize first letter of region (this is mostly to fix "the United States" looking weird) */}
            <Heading as="h4" fontSize="lg" mb={1}>
              {regionKey?.charAt(0).toUpperCase()}
              {regionKey?.substring(1)}
            </Heading>
            {regionsByCountry[regionKey!]?.map((r) => (
              <Box display="inline-block" m={2}>
                <Radio
                  isChecked={region === r.name}
                  onClick={() => {
                    setRegion(r.name);
                    setHasSelection(true);
                    setIsOrganize(false);
                  }}
                >
                  {r.name}
                </Radio>
              </Box>
            ))}
          </Box>
        ))
      }
      <Divider m={4} />
      {/* Clear region state in case they clicked some other region button before this */}
      <Button
        mt={2}
        data-active={isOrganize ? "" : undefined}
        onClick={() => {
          setIsOrganize(true);
          setRegion("");
        }}
      >
        {m.www_region_no_city()}
      </Button>
      <Collapse in={isOrganize} animateOpacity>
        <Divider m={4} />
        <Box>
          <Heading as="h3" fontSize="xl" mb={2}>
            {m.www_region_organizer_interest()}
          </Heading>
          <Text>{m.www_region_organizer_desc()}</Text>
          <Text>
            {m.www_region_organizer_manage()}
          </Text>
          <Text fontSize="sm">
            {m.www_region_organizer_no_experience()}
          </Text>
          <Box m={6}>
            <Collapse in={commitmentLevel >= 0} animateOpacity>
              <Text>
                <Checkbox onChange={(e: any) => setCommitmentLevel(e.target.checked ? 1 : 0)}>
                  <b>{m.www_region_organize_interest()}</b>
                </Checkbox>
              </Text>
              <br />
            </Collapse>
            <Collapse in={commitmentLevel >= 1} animateOpacity>
              <Text>
                {m.www_region_organize_city_question()}
                <TextInput
                  value={region}
                  onChange={(e: any) => {
                    setRegion(e.target.value);
                    setHasSelection(true);
                  }}
                  w="md"
                  display="block"
                />
              </Text>
              <br />
            </Collapse>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
