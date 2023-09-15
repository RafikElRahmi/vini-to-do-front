"use client";
import axios, { AxiosInstance } from "axios";
import { getTokens, tokenization } from "../auth/token";
import { clearAllCookies } from "../auth/cookie";

// Create an axios instance
const axiosApi: AxiosInstance = axios.create({
  baseURL: `https://vini-to-do-app-back.vercel.app/api/v1-0-0`,
  headers: {
    credentials: true,
  },
});
let retryCount = 0;
const maxRetries = 2;

axiosApi.interceptors.request.use(
  (config) => {
    const { access_token, refresh_token } = getTokens();

    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    if (refresh_token) {
      config.headers["Authentication"] = `Bearer ${refresh_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosApi.interceptors.response.use(
  (response) => {
    retryCount = 0;
    return response;
  },
  async (error) => {
    const { config, response } = error;

    if (response?.status === 401 && retryCount < maxRetries) {
      const { access_token, refresh_token } = getTokens();
      if (!refresh_token.length) {
        clearAllCookies();
      }
      await axiosApi.get(`/refresh`, {}).then(async (res) => {
        tokenization(res);
      });
      if (access_token) {
        config.headers["Authorization"] = `Bearer ${access_token}`;
      }
      if (refresh_token) {
        config.headers["Authentication"] = `Bearer ${refresh_token}`;
      }
      retryCount++;
      return axiosApi(config);
    }
    if (response?.status !== 401) {
      retryCount = 0;
    }
    if (response?.status === 307) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosApi;
