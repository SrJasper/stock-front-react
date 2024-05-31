/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { create } from "zustand";
import Cookies from "js-cookie";

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
  error?: {message?: string}
  isLoading: boolean
}

type Actions = {
  login: (credentials: ILoginCredentials) => Promise<void>
  register: (credentials: IRegisterCredentials) => Promise<void>
  resetErrors: () => void
  logout: () => void
  getUser: () => void
}


const useAuth = create<States & Actions>((set) => ({
  user: undefined ,
  error: undefined,
  isLoading: false,
  login: async (credentials: ILoginCredentials) => {
    set(() => ({isLoading: true}))
    try {
      const res = await axios.post("https://stock-project-seven.vercel.app/auth/login", credentials)

      Cookies.set("refreshToken", res.data)

      const token =  Cookies.get("refreshToken")
      set(() => ({user:token}))
    } catch (err: any) {
      set(() => ({error: err.response.data}))
    } finally {
      set(() => ({isLoading: false}))
    }
  },
  register: async (credentials) => {
    set(() => ({isLoading: true}))
    try {
    await axios.post("https://stock-project-seven.vercel.app/users", credentials)
  
    } catch (err: any) {
      set(() => ({error: err.response.data}))
    } finally {
      set(() => ({isLoading: false}))
    }
  },
  resetErrors: () => {
    set(() => ({error: undefined}))
  },
  logout: () => {
    Cookies.remove("refreshToken")
    set(() => ({user: undefined}))
  },
  getUser: () => {
    const token = Cookies.get("refreshToken")
    set(() => ({user: token}))
  }

})
)

export {useAuth}