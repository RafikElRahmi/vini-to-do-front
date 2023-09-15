"use client";
import axiosApi from "@/utils/api/axiosapi";
import { clearAllCookies } from "@/utils/auth/cookie";
import { getTokens, tokenization } from "@/utils/auth/token";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";

const AuthUser = React.createContext(null);
export const Auth = ({ children }) => {
  const router = useRouter()
  let Logged = false;
  let isToken = false;
  let isVerified = false;
  let retry = false;
  const isLogged = async () => {
    let { access_token, refresh_token } = getTokens();
    isToken = false;
    if (!refresh_token.length) {
      logout();
      return {Logged, isVerified };
    }
    if (!access_token.length) {
      await refresh();
      if (!isToken) {
        logout();
        return {  Logged, isVerified };
      } else {
        ({ access_token, refresh_token } = getTokens());
      }
    } else {
      isToken = true;
    }
    await axiosApi
      .get(`/auth`, {
        headers: {
          authorization: `Bearer ${access_token}`,
          authentication: `Bearer ${refresh_token}`,
        },
      })
      .then((res) => {
        ({ Logged, isVerified } = res.data);
        isToken = false;
      })
      .catch(async(err) => {
        const status = err.response?.status;
        if (status === 401 || !retry) {
          retry = true
          await refresh();
          ({ Logged, isVerified } = await isLogged())
        } else {
          logout();
        }
      });
    return {  Logged, isVerified };
  };
  const logout = () => {
    Logged = false;
    isToken = false;
    isVerified = false;
    retry = false;
    clearAllCookies();
  };
  const refresh = async () => {
    const { access_token, refresh_token } = getTokens();
    if (!refresh_token.length) {
      clearAllCookies();
    }
    await axiosApi
      .get(`/refresh`, {
      })
      .then(async (res) => {
        tokenization(res);
        isToken = true;
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status) {
          logout();
        }
      });
  };
  const setLogout = async () => {
    await axiosApi.get('/logout')
    logout()
    router.push('/')
  }
  return (
    <AuthUser.Provider value={{ isLogged, setLogout, refresh }}>
      {children}
    </AuthUser.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthUser);
  return context;
};
