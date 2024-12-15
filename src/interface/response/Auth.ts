import { Role } from "./Api";

export interface Auth {
  id: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
  type: "Bearer";
}
