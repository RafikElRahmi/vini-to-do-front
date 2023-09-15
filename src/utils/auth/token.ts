import { getCookie } from "./cookie";

export function tokenization(res) {
    const tokenHeader = res.headers.get("authorization");
    const expires = res.headers.get("expiration");
    const refreshHeader = res.headers.get("authentication");
    const refreshExpires = res.headers.get("Refresh-Expiration");
    const token = tokenHeader?.split(" ")[1];
    const refresh = refreshHeader?.split(" ")[1];
    document.cookie = `access-token=${token}; expires=${new Date(
      expires
  ).toUTCString()}; path=/`;
  if (refresh) {
    document.cookie = `refresh-token=${refresh}; expires=${new Date(
      refreshExpires
    ).toUTCString()}; path=/`;
  }
    return null;
 
}

export function getTokens() {
  const access_token = getCookie("access-token");
  const refresh_token = getCookie("refresh-token");
  return { access_token, refresh_token };
}
