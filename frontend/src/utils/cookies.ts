import Cookies from "universal-cookie";
import { Player } from "../websockets/MessageType";

const cookies = new Cookies();

export enum CookieKey {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
  EXPIRES_AT = "expires_at",
  GAME_ID = "game_id",
  PLAYER = "player"
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

export const getToken = (): string => {
  return cookies.get(CookieKey.ACCESS_TOKEN);
};

export const getGameIdFromCookies = (): string | undefined => {
  return cookies.get(CookieKey.GAME_ID);
};

export const setGameIdCookie = (gameId: string): void => {
  cookies.set(CookieKey.GAME_ID, gameId, { path: "/" });
};

export const getPlayerCookie = (): Player | undefined => {
  return cookies.get(CookieKey.PLAYER);
};

export const setPlayerCookie = (player: Player): void => {
  cookies.set(CookieKey.PLAYER, player, { path: "/" });
};
