import { ArtAna } from "./art-ana";

export type TipoTrasferta =
  | "in_giornata"
  | "in_giornata_dopo_21"
  | "fuori_sede_andata"
  | "fuori_sede_ritorno";

export type ArticoliCostiCfComm = {
  id: Number;
  createdAt: Date;
  updatedAt: Date;
  CF_COMM_ID: String;
  COD_ART: string | null;
  TIPO_TRASFERTA: TipoTrasferta;
  artAna: ArtAna;
};
