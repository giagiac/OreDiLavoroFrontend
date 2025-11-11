export type HypServReq2 = {
  COD_CHIAVE: string;

  NUM_AZIENDA?: number | null;

  COD_REQ2_HYPSERV: string;

  PROGR?: number | null;

  UTENTE_FROM?: string | null;

  // Nuove proprietà
  DATAORA_RICHIESTA?: Date;

  CAMPO_PARAMETRI?: string;

  FLAG_STATUS?: number;

  DATAORA_INIZIO_ELAB?: Date;

  UTENTE_ELAB?: string;

  DATAORA_FINE_ELAB?: Date;

  FLAG_ESITO_ELAB?: number;

  STRINGA_ESITO_ELAB?: string;
};
