export enum RoleEnum {
  ADMIN = 1,
  USER = 2,
  AUTISTA = 3,
  BADGE = 4,
}

export type Role = {
  id: number | string;
  name?: string;
};
