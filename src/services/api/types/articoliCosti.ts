import { CfComm } from "./cfComm";

export type ArticoliCosti = {
  costo1?: string;
  costo2?: string;
  CF_COMM_ID: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  CfComm?: CfComm;
};
