import Decimal from "decimal.js";
import { TipoTrasferta } from "./eps-nestjs-orp-eff-cicli-esec";
import { ArtAna } from "./art-ana";
import { Operatori } from "./operatori";
import { OrpEffCicli } from "./orp-eff-cicli";
import { OrpEffCicliEsec } from "./orp-eff-cicli-esec";
import { OrpEff } from "./orp-eff";

export type EpsNestjsOrpEffCicliEsecChild = {
  id: string;
  idfk: string;
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
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM?: string | null;
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA?: string | null;

  HYPSERV_REQ2_COD_CHIAVE_DELETED?: number | null;
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM_DELETED?: number | null;
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA_DELETED?: number | null;

  TEMPO_OPERATORE_SESSANTESIMI?: String | null;

  orpEffCicliEsec?: OrpEffCicliEsec | null;
  orpEffCicli?: OrpEffCicli | null;
  operatori?: Operatori | null;

  artAna?: ArtAna | null;

  orpEffPadre?: OrpEff | null;
};
