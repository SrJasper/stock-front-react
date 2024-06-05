/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import Cookies from "js-cookie";
import { api } from "../config/api";

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type States = {
  user?: string;
  error?: { message?: string };
  isLoading: boolean;
};

type Actions = {
  login: (credentials: ILoginCredentials) => Promise<void>;
  register: (credentials: IRegisterCredentials) => Promise<void>;
  resetErrors: () => void;
  logout: () => void;
  getUser: () => Promise<string>;
};

const useAuth = create<States & Actions>((set) => ({
  user: undefined,
  error: undefined,
  isLoading: false,
  login: async (credentials: ILoginCredentials) => {
    set(() => ({ isLoading: true }));
    try {
      const res = await api.post("/auth/login", credentials);

      Cookies.set("refreshToken", res.data);

      const token = Cookies.get("refreshToken");

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      set(() => ({ user: token }));
    } catch (err: any) {
      set(() => ({ error: err.response.data }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  register: async (credentials) => {
    set(() => ({ isLoading: true }));
    try {
      await api.post("/users", credentials);
    } catch (err: any) {
      set(() => ({ error: err.response.data }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  resetErrors: () => {
    set(() => ({ error: undefined }));
  },
  logout: () => {
    Cookies.remove("refreshToken");
    set(() => ({ user: undefined }));
  },
  getUser: async () => {
    const token = Cookies.get("refreshToken");
    set(() => ({ user: token }));
    return String(token);
  },
}));
export { useAuth };
