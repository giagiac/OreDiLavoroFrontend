import Decimal from "decimal.js";
import { Operatori } from "./operatori";
import { OrpEffCicli } from "./orp-eff-cicli";
import { OrpEffCicliEsec } from "./orp-eff-cicli-esec";
import { ArtAna } from "./art-ana";
import {
  EpsNestjsOrpEffCicliEsec,
  TipoTrasferta,
} from "./eps-nestjs-orp-eff-cicli-esec";
import { HypServReq2 } from "./hyp-serv-req2";
import { AppReq3HypServ } from "./app-req3-hypserv";

export type EpsNestjsOrpEffCicliEsecFailed = {
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
  HYPSERV_REQ2_COD_CHIAVE: string | null;
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM?: string | null;
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA?: string | null;

  TIPO_TRASFERTA: TipoTrasferta;

  HYPSERV_REQ2_COD_CHIAVE_DELETED?: number | null;
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_KM_DELETED?: number | null;
  APP_REQ3_HYPSERV_COD_CHIAVE_COSTO_OPERATORE_TRASFERTA_DELETED?: number | null;

  TEMPO_OPERATORE_SESSANTESIMI?: String | null;

  ERROR_SYNC_COSTO_KM?: number | null;
  ERROR_SYNC_COSTO_OPERATORE_TRASFERTA?: number | null;
  ERROR_SYNC_ESECUZIONE_OPERATORE?: number | null;

  orpEffCicliEsec?: OrpEffCicliEsec | null;
  orpEffCicli?: OrpEffCicli | null;
  operatori?: Operatori | null;

  artAna?: ArtAna | null;

  orpEffCicliPadre?: OrpEffCicli | null;

  appReq3HypServCostoKm: AppReq3HypServ | null;
  appReq3HypServCostoOperatoreTrasferta: AppReq3HypServ | null;
  hypServReq2: HypServReq2 | null;

  gruppoDiLavoro?: Array<EpsNestjsOrpEffCicliEsec> | null;

  epsNestjsOrpEffCicliEsecChild?: EpsNestjsOrpEffCicliEsecFailed[] | null;
};
