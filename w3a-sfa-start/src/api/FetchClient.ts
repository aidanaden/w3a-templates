/**
 * A simple and minimal wrapper around the native `fetch` API.
 */
export class FetchClient {
  private static async query(
    url: string | URL,
    method: "GET" | "POST" | "PUT" | "DELETE",
    options: RequestInit = {},
  ) {
    const res = await fetch(url, {
      ...options,
      method,
      headers: {
        ...options.headers,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
    });
    return res.json();
  }

  /**
   * Performs a GET request to the given `endpoint`, and returns the JSON response.
   */
  public static async get<T>(
    endpoint: string,
    searchParams?: Record<string, string> | undefined,
    options: RequestInit = {},
  ): Promise<T> {
    const url = new URL(endpoint);
    url.search = new URLSearchParams(searchParams).toString();
    return this.query(url, "GET", options);
  }

  /**
   * Performs a POST request to the given `endpoint`, and returns the JSON response.
   */
  public static async post<T>(
    endpoint: string,
    body: Record<string, unknown>,
    options: RequestInit = {},
  ): Promise<T> {
    return this.query(endpoint, "POST", {
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * Performs a PUT request to the given `endpoint`, and returns the JSON response.
   */
  public static async put<T>(
    endpoint: string,
    body: Record<string, unknown>,
    options: RequestInit = {},
  ): Promise<T> {
    return this.query(endpoint, "PUT", {
      body: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * Performs a DELETE request to the given `endpoint`, and returns the JSON response.
   */
  public static async delete<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    return this.query(endpoint, "DELETE", options);
  }
}
