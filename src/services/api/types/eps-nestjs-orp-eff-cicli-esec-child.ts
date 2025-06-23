import Decimal from "decimal.js";
import { TipoTrasferta } from "./eps-nestjs-orp-eff-cicli-esec";

export type EpsNestjsOrpEffCicliEsecChild = {
  id: string;
  idfk: number;
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
};
