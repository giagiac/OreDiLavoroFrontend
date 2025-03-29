import { EpsNestjsOrpEffCicliEsec } from "./eps-nestjs-orp-eff-cicli-esec";
import { OrpEffCicli } from "./orp-eff-cicli";

export type OrpEffCicliEsec = {
  DATA_FINE?: Date | null;
  DATA_INIZIO?: Date | null;
  TEMPO_OPERATORE?: number | null;
  DOC_RIGA_ESEC_ID: string;
  NUM_ESEC?: number | null;
  DOC_RIGA_ID?: string | null;
  NUM_RIGA?: string | null;
  DOC_ID?: string | null;
  AZIENDA_ID?: number | null;
  CODICE_BREVE: string;
  orpEffCicli?: OrpEffCicli[] | null;
  epsNestjsOrpEffCicliEsec?: EpsNestjsOrpEffCicliEsec | null;
};
