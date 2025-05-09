import { OrdCliRighe } from "./ord-cli-righe";

export type LinkOrpOrd = {
  LINK_ORP_ORD_ID: string;
  ORP_EFF_DOC_ID: string;
  ORD_CLI_DOC_RIGA_ID: string;

  ordCliRighe?: OrdCliRighe | null;
};
