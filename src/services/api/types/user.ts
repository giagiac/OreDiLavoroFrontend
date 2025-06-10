import { Cf } from "./cf";
import { FileEntity } from "./file-entity";
import { Operatori } from "./operatori";
import { Role } from "./role";

export enum UserProviderEnum {
  EMAIL = "email",
  GOOGLE = "google",
}

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photo?: FileEntity;
  provider?: UserProviderEnum;
  socialId?: string;
  role?: Role;

  COD_OP?: string | null;
  CF_ORIGIN_DEFAULT?: string | null;

  operatori: Operatori | null;
  cfOriginDefault: Cf | null;
};
