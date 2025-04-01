import { OrpEffCicli } from "./orp-eff-cicli";
import { X1TrasCodici } from "./x1-tras-codici";

export type OrpEff = {
  DATA_DOC: Date;
  SERIE_DOC: string;
  NUM_DOC: number;
  ANNO_DOC: string;
  DOC_ID: string;
  AZIENDA_ID?: number | null;
  DES_PROD: string | null;
  COD_ART: string | null;
  STATUS?: number | null;

  orpEffCicli?: OrpEffCicli | null;
  x1TrasCodici?: X1TrasCodici | null;
};
