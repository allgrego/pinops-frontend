/**
 *  - - - Incoterms
 */
export const Incoterms = {
  CIF: "CIF",
  FOB: "FOB",
  EXW: "EXW",
  FCA: "FCA",
  CPT: "CPT",
  CIP: "CIP",
  DAP: "DAP",
  DDP: "DDP",
  // Add others here
} as const;

export type IncotermKey = keyof typeof Incoterms;

export type Incoterm = (typeof Incoterms)[IncotermKey];

export const allIncoterms: Incoterm[] = Object.values(Incoterms);
