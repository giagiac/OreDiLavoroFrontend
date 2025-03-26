import { ArtCosti } from "./art-costi";

export type ArtAna = {
  COD_ART: string;
  DES_ART: string;
  COD_CAT: string;
  // ----------------------

  artCosti?: Array<ArtCosti> | null;
};
