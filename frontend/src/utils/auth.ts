import Cookies from "universal-cookie";

const cookies = new Cookies();

export enum CookieKey {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
  EXPIRES_AT = "expires_at"
}

export const isTokenExpired = (): boolean => {
  if (!cookies.get(CookieKey.EXPIRES_AT)) {
    return true;
  }

  return parseInt(cookies.get(CookieKey.EXPIRES_AT)) < new Date().getTime();
};

export const isTokenValid = (): boolean => {
  const hasToken = !!cookies.get(CookieKey.ACCESS_TOKEN);
  const isTokenValid = !isTokenExpired();
  return hasToken && isTokenValid;
};
