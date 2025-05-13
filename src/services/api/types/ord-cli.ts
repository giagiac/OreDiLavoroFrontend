import { CfComm } from "./cfComm";

export type OrdCli = {
  NUM_SEDE?: string | null;
  COD_CF?: string | null;

  DATA_DOC: Date;
  SERIE_DOC: string;
  NUM_DOC: number;
  ANNO_DOC: string;
  DOC_ID: string;

  AZIENDA_ID?: number | null;

  cfComm?: CfComm | null;
};
