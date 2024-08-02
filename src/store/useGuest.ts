/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import Cookies from "js-cookie";
import { api } from "../config/api";


type States = {
  guest?: string;
  error?: { message?: string };
  isLoading: boolean;
};

type Actions = {
  guestLogin: () => Promise<void>;
  resetErrorsGuest: () => void;
  logoutGuest: () => void;
  getGuest: () => Promise<string>;
};

const useGuest = create<States & Actions>((set) => ({
  guest: undefined,
  error: undefined,
  isLoading: false,
  guestLogin: async () => {
    set(() => ({ isLoading: true }));
    try {
      const res = await api.post("/auth/guest");

      Cookies.set("refreshToken", res.data);

      const token = Cookies.get("refreshToken");

      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      set(() => ({ guest: token }));
    } catch (err: any) {
      set(() => ({ error: err.response.data }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },  
  resetErrorsGuest: () => {
    set(() => ({ error: undefined }));
  },
  logoutGuest: () => {
    Cookies.remove("refreshToken");
    set(() => ({ guest: undefined }));
  },
  getGuest: async () => {
    const token = Cookies.get("refreshToken");
    set(() => ({ guest: token }));
    return String(token);
  },
}));
export { useGuest };
