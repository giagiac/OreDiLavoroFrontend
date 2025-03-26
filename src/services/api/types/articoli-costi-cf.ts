import { ArtAna } from "./art-ana";
import { ArtCosti } from "./art-costi";

export type TipoCosto =
  | "IN_GIORNATA"
  | "IN_GIORNATA_DOPO_21"
  | "PERNOTTO_FUORISEDE_ANDATA"
  | "PERNOTTO_FUORISEDE_RITORNO";

export type ArticoliCostiCf = {
  id: Number,
  createdAt: Date,
  updatedAt: Date,
  COD_CF: string,
  COD_ART: string,
  TIPO_COSTO: TipoCosto

  artAna: ArtAna;
};
