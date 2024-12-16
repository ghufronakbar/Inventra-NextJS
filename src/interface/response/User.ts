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

export const initUser: User = {
  id: "",
  name: "",
  email: "",
  picture: "",
  role: "SUPER_ADMIN",
  isConfirmed: false,
  isActived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export interface UserWithAuth extends User {
  accessToken: string;
  refreshToken: string;
}
