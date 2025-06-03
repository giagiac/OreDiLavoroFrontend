import Decimal from "decimal.js";
import { Operatori } from "./operatori";
import { OrpEffCicli } from "./orp-eff-cicli";
import { OrpEffCicliEsec } from "./orp-eff-cicli-esec";
import { EpsNestjsOrpEffCicliEsecChild } from "./eps-nestjs-orp-eff-cicli-esec-child";
import { ArtAna } from "./art-ana";

export type TipoTrasferta =
  | "in_sede"
  | "in_giornata"
  | "in_giornata_dopo_21"
  | "fuori_sede_andata"
  | "fuori_sede_ritorno"
  | "ancora_in_trasferta_0"
  | "ancora_in_trasferta_10"
  | "ancora_in_trasferta_20"
  | "ancora_in_trasferta_30"
  | "ancora_in_trasferta_40"
  | "step1_km_autista";

export type EpsNestjsOrpEffCicliEsec = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  TEMPO_MINUTI_OP?: Decimal | null;
  TEMPO_MINUTI_MACC?: Decimal | null;
  NOTE?: string | null;
  DATA_FINE?: Date | null;
  DATA_INIZIO?: Date | null;
  TEMPO_OPERATORE?: Decimal | null;
  TEMPO_MACCHINA?: Decimal | null;
  COD_OP?: string | null;
  COD_ART?: string | null;
  KM?: Decimal | null;
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

  artAna?: ArtAna | null;

  epsNestjsOrpEffCicliEsecChild?: Array<EpsNestjsOrpEffCicliEsecChild> | null;
};
