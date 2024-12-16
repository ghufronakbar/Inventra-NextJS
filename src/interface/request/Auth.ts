export interface LoginForm {
  email: string;
  password: string;
}

export const initLoginForm: LoginForm = {
  email: "",
  password: "",
};

export interface RegisterForm {
  email: string;
  name: string;
}

export const initRegisterForm: RegisterForm = {
  email: "",
  name: "",
};
