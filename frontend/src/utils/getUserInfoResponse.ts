import { Method } from "axios";
import { axiosRequest } from "../pages/ConnectedPages/components/axiosRequest";

export const getUserInfoResponse = async () => {
  const requestUser = {
    method: "GET" as Method,
    url: "https://api.spotify.com/v1/me",
  };
  const responseUser = await axiosRequest(requestUser);

  return responseUser;
};
