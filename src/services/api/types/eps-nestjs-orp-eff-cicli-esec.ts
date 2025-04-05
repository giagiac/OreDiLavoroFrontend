import Decimal from "decimal.js";
import { OrpEffCicliEsec } from "./orp-eff-cicli-esec";
import { OrpEffCicli } from "./orp-eff-cicli";
import { Operatori } from "./operatori";

export type EpsNestjsOrpEffCicliEsec = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  
  APP_REQ3_SYNCED?: number | null;
  TEMPO_MINUTI_OP?: Decimal | null;
  TEMPO_MINUTI_MACC?: Decimal | null;
  NOTE?: string | null;
  DATA_FINE?: Date | null;
  DATA_INIZIO?: Date | null;
  TEMPO_OPERATORE?: Decimal | null;
  TEMPO_MACCHINA?: Decimal | null;
  COD_OP?: string | null;
  COD_ART?: string | null;
  DOC_RIGA_ESEC_ID?: string | null;
  DOC_RIGA_ID?: string | null;
  NUM_RIGA?: number | null;
  DOC_ID?: string | null;
  AZIENDA_ID?: number | null;
  TIPO_TRASFERTA: string;

  TEMPO_OPERATORE_SESSANTESIMI?: String | null;
  
  orpEffCicliEsec?: OrpEffCicliEsec | null;
  orpEffCicli?: OrpEffCicli | null;
  operatori?: Operatori | null;
};
