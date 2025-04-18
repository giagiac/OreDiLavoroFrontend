import { ArtAna } from "./art-ana";

export type TipoCosto =
  | "IN_GIORNATA"
  | "IN_GIORNATA_DOPO_21"
  | "PERNOTTO_FUORISEDE_ANDATA"
  | "PERNOTTO_FUORISEDE_RITORNO";

export type ArticoliCostiCfComm = {
  id: Number;
  createdAt: Date;
  updatedAt: Date;
  CF_COMM_ID: String;
  COD_ART: string;
  TIPO_COSTO: TipoCosto;
  artAna: ArtAna;
};
