import { EpsNestjsOrpEffCicliEsec } from "./eps-nestjs-orp-eff-cicli-esec";
import { LinkOrpOrd } from "./link-orp-ord";
import { OrpEff } from "./orp-eff";
import { OrpEffCicliEsec } from "./orp-eff-cicli-esec";

export type TipoTrasferta =
  | "in_giornata"
  | "in_giornata_dopo_21"
  | "fuori_sede_andata"
  | "fuori_sede_ritorno"
  | "ancora_in_trasferta_10"
  | "ancora_in_trasferta_20"
  | "ancora_in_trasferta_30"
  | "ancora_in_trasferta_40"
  | "step1_km_autista";

export type OrpEffCicli = {
  CODICE_BREVE?: string | null;

  DES_LAV?: string | null;
  DES_CICLO?: string | null;
  DOC_RIGA_ID: string;
  NUM_RIGA: number;
  DOC_ID: string;
  AZIENDA_ID: number;

  orpEff: OrpEff;
  linkOrpOrd?: Array<LinkOrpOrd> | null;
  orpEffCicliEsec?: OrpEffCicliEsec | null;
  epsNestjsOrpEffCicliEsec?: EpsNestjsOrpEffCicliEsec | null;
};
