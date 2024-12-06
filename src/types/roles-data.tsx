import { Role } from "./role";

type RolePlayRate = {
  playRate: number;
};

export type ChampionRoles = {
  [role in Role]: RolePlayRate;
};

export type RolesData = {
  data: {
    [championId: string]: ChampionRoles;
  };
};