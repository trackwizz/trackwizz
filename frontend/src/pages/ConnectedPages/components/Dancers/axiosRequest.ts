import axios, { AxiosRequestConfig } from "axios";

function createHeader(token: string) {
  return {
    headers: {
      Authorization: "Bearer " + token
    }
  };
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

export { createHeader, axiosRequest };
