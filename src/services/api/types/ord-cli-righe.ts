import { Cf } from "./cf";
import { OrdCliTras } from "./ord-cli-tras";

export type OrdCliRighe = {
  LINK_ORP_ORD_ID: string;
  ORP_EFF_DOC_ID: string;
  ORD_CLI_DOC_RIGA_ID: string;

  cf: Cf;
  ordCliTras: OrdCliTras;
};
