import Decimal from "decimal.js";
import { OrpEffCicliEsec } from "./orp-eff-cicli-esec";
import { OrpEffCicli } from "./orp-eff-cicli";
import { Operatori } from "./operatori";

export type TipoTrasferta =
  | "in_sede"
  | "in_giornata"
  | "in_giornata_dopo_21"
  | "fuori_sede_andata"
  | "fuori_sede_ritorno"
  | "ancora_in_missione_5"
  | "ancora_in_missione_10"
  | "ancora_in_missione_15"
  | "ancora_in_missione_20"
  | "step1_KmAutista";

// export enum TipoTrasferta {
//   "in_sede" = "in_sede",
//   "in_giornata" = "in_giornata",
//   "in_giornata_dopo_21" = "in_giornata_dopo_21",
//   "fuori_sede_andata" = "fuori_sede_andata",
//   "fuori_sede_ritorno" = "fuori_sede_ritorno",
//   "ancora_in_missione_5" = "ancora_in_missione_5",
//   "ancora_in_missione_10" = "ancora_in_missione_10",
//   "ancora_in_missione_15" = "ancora_in_missione_15",
//   "ancora_in_missione_20" = "ancora_in_missione_20",
//   "step1_KmAutista" = "step1_KmAutista",
// }

export type EpsNestjsOrpEffCicliEsec = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  SYNCED?: number | null;
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
  TIPO_TRASFERTA: TipoTrasferta;
  HYPSERV_REQ2_COD_CHIAVE: string | null;
  APP_REQ3_HYPSERV_COD_CHIAVE?: string | null;

  TEMPO_OPERATORE_SESSANTESIMI?: String | null;

  orpEffCicliEsec?: OrpEffCicliEsec | null;
  orpEffCicli?: OrpEffCicli | null;
  operatori?: Operatori | null;
};
