import { ArtAna } from "./art-ana";
import { ArtCosti } from "./art-costi";
import { OrpEffCicli } from "./orp-eff-cicli";

export type OrdCliRighe = {
  ordCliRighe?: OrdCliRighe | null;
  LINK_ORP_ORD_ID: string;
  ORP_EFF_DOC_ID: string;
  ORD_CLI_DOC_RIGA_ID: string;
  orpEffCicli: OrpEffCicli;
};
