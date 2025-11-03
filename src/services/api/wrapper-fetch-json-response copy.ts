import { useSnackbar } from "../../hooks/use-snackbar";
import { FetchJsonResponse } from "./types/fetch-json-response";
import HTTP_CODES_ENUM from "./types/http-codes";
import { ValidationErrors } from "./types/validation-errors";

async function wrapperFetchJsonResponse<T>(
  response: Response
): Promise<FetchJsonResponse<T> | ValidationErrors> {
  const status = response.status as FetchJsonResponse<T>["status"];
  
  // return {
  //   status,
  //   data: [
  //     HTTP_CODES_ENUM.NO_CONTENT,
  //     HTTP_CODES_ENUM.SERVICE_UNAVAILABLE,
  //     HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR,
  //     HTTP_CODES_ENUM.BAD_REQUEST,
  //     HTTP_CODES_ENUM.UNAUTHORIZED,
  //     HTTP_CODES_ENUM.FORBIDDEN,
  //     HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY,

  //     HTTP_CODES_ENUM.NOT_FOUND,
  //     HTTP_CODES_ENUM.GATEWAY_TIMEOUT,
  //   ].includes(status)
  //     ? undefined
  //     : await response.json().catch,
  // };

  // // Controlla se lo status è OK (200-299)
  // if (response.ok) {
  //   // Risposta di successo: analizza il JSON e restituisce SuccessResponse
  //   return response.json().then(data => ({
  //     success: true,
  //     data: data as T, // Cast al tipo generico T
  //   }));
  // }

  // Risposta di errore: prova ad analizzare il corpo come errore JSON,
  // altrimenti usa un errore generico.
  return response
    .json()
    .catch(() => {
      // Fallback se il corpo non è JSON (es. 404/500 con corpo vuoto)
      debugger;
      return Promise.resolve({
        success: false,
        error: {
          status: response.status,
          message: `Errore HTTP: ${response.statusText || "Errore sconosciuto"}`,
        },
      } as any);
    })
    .then((body) => {
      if (response.ok) {
        return {
          status,
          data: body as T,
        } as FetchJsonResponse<T>;
      }

      debugger;

      return {
        success: false,
        error: {
          status: response.status,
          // Assumendo che il corpo di errore contenga un campo 'message' o si possa usare response.statusText
          message: body.message || response.statusText || "Errore del server",
          details: body,
        },
      } as any;
    });
}

export default wrapperFetchJsonResponse;
