export type AppReq3HypServ = {
  COD_CHIAVE: string;

  NUM_AZIENDA?: number | null;

  COD_REQ3_HYPSERV: string;

  PROGR?: number | null;

  UTENTE_FROM?: string | null;

  // Nuove proprietà
  DATAORA_RICHIESTA?: Date;

  CHIAVE_ESTERNA?: string;

  CAMPO_PARAMETRI?: string;

  FLAG_STATUS?: number;

  DATAORA_INIZIO_ELAB?: Date;

  UTENTE_ELAB?: string;

  DATAORA_FINE_ELAB?: Date;

  FLAG_ESITO_ELAB?: number;

  STRINGA_ESITO_ELAB?: string;
};
