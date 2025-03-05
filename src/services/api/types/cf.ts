import { CfComm } from "./cfComm";

export type Cf = {
  isOpen: boolean;

  //---------------------
  COD_FISC_CF?: string;
  P_IVA_CF?: string;
  RAG_SOC_CF_INT?: string;
  RAG_SOC_CF?: string;
  COD_CF: string;
  cfComm?: CfComm[];
};
