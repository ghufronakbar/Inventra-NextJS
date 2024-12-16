export interface User {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  role: "SUPER_ADMIN" | "ADMIN";
  isConfirmed: boolean;
  isActived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
