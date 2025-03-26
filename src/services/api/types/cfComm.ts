import { ArticoliCostiCfComm } from "./articoli-costi-cf-comm";

export type CfComm = {
  NOTE_SEDE?: string;
  RIFERIMENTO_SEDE?: string;
  E_MAIL_SEDE?: string;
  FAX_SEDE?: string;
  TEL_SEDE?: string;
  PROVINCIA_SEDE?: string;
  COMUNE_SEDE?: string;
  CAP_SEDE?: string;
  INDI_SEDE?: string;
  CF_COMM_ID: string;
  COD_CF: string;
  DES_SEDE?: string;
  NUM_SEDE: string;
  // ----------------------

  articoliCostiCfComm?: Array<ArticoliCostiCfComm> | undefined;
};
