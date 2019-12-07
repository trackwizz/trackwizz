import Cookies from 'universal-cookie';

const cookies = new Cookies();

export enum CookieKey {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

export const isLoggedIn = (): boolean => {
  // TODO return false if access token expired
  return !!cookies.get(CookieKey.ACCESS_TOKEN);
};