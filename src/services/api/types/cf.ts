import { ArticoliCostiCf } from "./articoli-costi-cf";
import { CfComm } from "./cfComm";

export type Cf = {
  COD_FISC_CF?: string;
  P_IVA_CF?: string;
  RAG_SOC_CF_INT?: string;
  RAG_SOC_CF?: string;
  COD_CF: string;

  PROVINCIA_CF?: string | null,
  COMUNE_CF: string | null,
  CAP_CF: string | null,
  INDI_CF: string | null,
  STATO_CF: string | null,
  REGIONE: string | null,
  
  articoliCostiCf?: Array<ArticoliCostiCf> | undefined;
};
