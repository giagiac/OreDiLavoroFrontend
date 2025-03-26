import { ArticoliCostiCf } from "./articoli-costi-cf";
import { CfComm } from "./cfComm";

export type Cf = {
  COD_FISC_CF?: string;
  P_IVA_CF?: string;
  RAG_SOC_CF_INT?: string;
  RAG_SOC_CF?: string;
  COD_CF: string;
  
  articoliCostiCf?: Array<ArticoliCostiCf> | undefined;
};
