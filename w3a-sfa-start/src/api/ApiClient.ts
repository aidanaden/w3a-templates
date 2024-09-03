import { FetchClient } from "./FetchClient";

const API_URL = "https://ape-api.aidan-267.workers.dev/api/v1";

type GetCallbackRequest = {
  oauth_token: string;
  oauth_verifier: string;
  oauth_token_secret: string;
};
type GetCallbackResponse = {
  email: string;
  access_token: string;
  refresh_token: string;
};

type GetRedirectUrlResponse = {
  redirect_url: string;
  oauth_token_secret: string;
};

export class ApiClient extends FetchClient {
  /**
   * GET request to get redirect url for twitter authentication
   */
  public static async loginTwitterGet(fetchOptions?: RequestInit) {
    return this.get<GetRedirectUrlResponse>(
      `${API_URL}/signin/twitter`,
      {},
      fetchOptions,
    );
  }

  /**
   * GET request to get permanent access/refresh tokens
   * from temporary oauth tokens received from twitter
   */
  public static async callbackTwitterGet(
    params: GetCallbackRequest,
    fetchOptions?: RequestInit,
  ) {
    return this.get<GetCallbackResponse>(
      `${API_URL}/callback/twitter`,
      params,
      fetchOptions,
    );
  }

  /**
   * POST request to refresh JWT tokens
   */
  // public static async refreshPost(
  //   params: PostRefreshRequest,
  //   accessToken: string,
  //   fetchOptions?: RequestInit
  // ) {
  //   return this.post<PostRefreshResponse>(`${API_URL}/api/refresh`, params, {
  //     ...fetchOptions,
  //     headers: {
  //       ...fetchOptions?.headers,
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  // }
}
