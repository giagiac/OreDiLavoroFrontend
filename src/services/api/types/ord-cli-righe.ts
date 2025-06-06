import { Cf } from "./cf";
import { OrdCli } from "./ord-cli";

export type OrdCliRighe = {
  DES_RIGA?: string | null;
  COD_ART?: string | null;
  COD_CF?: string | null;
  DOC_RIGA_ID: string;
  NUM_RIGA: number;
  DOC_ID: string;
  AZIENDA_ID?: number | null;

  cf: Cf;
  ordCli: OrdCli;
};
