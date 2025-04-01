import { EpsNestjsOrpEffCicliEsec } from "./eps-nestjs-orp-eff-cicli-esec";
import { LinkOrpOrd } from "./link-orp-ord";
import { OrpEff } from "./orp-eff";
import { OrpEffCicliEsec } from "./orp-eff-cicli-esec";

export type OrpEffCicli = {
  CODICE_BREVE?: string | null;
  
  DES_LAV?: string | null;
  DES_CICLO?: string | null;
  DOC_RIGA_ID: string;
  NUM_RIGA: number;
  DOC_ID: string;
  AZIENDA_ID?: number | null;

  orpEff: OrpEff;
  linkOrpOrd?: Array<LinkOrpOrd> | null;
  orpEffCicliEsec?: OrpEffCicliEsec | null;
  epsNestjsOrpEffCicliEsec?: EpsNestjsOrpEffCicliEsec | null;
};
