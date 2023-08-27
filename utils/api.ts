import axios, { AxiosHeaders, Method, ResponseType } from "axios";
import { log, logError } from "./log";

const instance = axios.create({
  baseURL: process.env.BASE_API_URL,
  timeout: 30000, // 30 sec timeout
  // transformResponse: (data) => {
  //   // If the response comes back with a particular format, we
  //   // can automatically extract the data we want in here, so
  //   // we don't have to do it each time we run a query

  //   // In this example, no transformation occurs.
  //   return data;
  // },

  responseType: "json",
  //   // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
  //   // This will set an `Authorization` header, overwriting any existing
  //   // `Authorization` custom headers you have set using `headers`.
  //   // Please note that only HTTP Basic auth is configurable through this parameter.
  //   // For Bearer tokens and such, use `Authorization` custom headers instead.
  //   auth: {
  //     username: 'janedoe',
  //     password: 's00pers3cret'
  //   },

  //   // specifies a cancel token that can be used to cancel the request
  //   cancelToken: new axios.CancelToken(function (cancel) {

  //   }),
});

function printAxiosError(err: any) {
  throw new Error(
    "AxiosError\n" +
      "StatusCode  " +
      err.code +
      "\n" +
      "Status      " +
      err.response.status +
      "\n" +
      "Error Msg   " +
      err.response.data.error
  );
}

export async function getAPIResponse(
  method: Method,
  url: string,
  params: any = {},
  headers: AxiosHeaders = AxiosHeaders.from({}),
  responseType: ResponseType = "json"
): Promise<any> {
  if (method == "GET") {
    return instance({
      url,
      method,
      responseType,
      params,
      headers,
    })
      .then((response) => {
        return Promise.resolve(response.data);
      })
      .catch(printAxiosError);
  } else {
    return instance({
      url,
      method,
      responseType,
      data: params,
      headers,
    })
      .then((response) => {
        return Promise.resolve(response.data);
      })
      .catch(printAxiosError);
  }
}
