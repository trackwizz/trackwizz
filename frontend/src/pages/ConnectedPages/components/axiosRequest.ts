import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "../../../utils/cookies";
import { BACKEND_API } from "../../../constants";

axios.defaults.baseURL = BACKEND_API;

function setDefaultAuthorization() {
  axios.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`;
}

interface IResponse<T> {
  data: null | T;
  error: null | boolean;
  complete: null | boolean;
}

async function axiosRequest<T>(req: AxiosRequestConfig): Promise<IResponse<T>> {
  let response: IResponse<T> = {
    data: null,
    error: null,
    complete: null
  };

  await axios(req)
    .then(
      res =>
        (response = {
          data: res.data,
          error: false,
          complete: true
        })
    )
    .catch(
      () =>
        (response = {
          data: null,
          error: true,
          complete: true
        })
    );

  return response;
}

export { setDefaultAuthorization, axiosRequest };
