import { ApiError } from "./ApiError";

export class ApiClient {
  // The public products API needs no user authorization.
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    // Only requests with a body need Content-Type. On a plain GET it would trigger a needless CORS preflight.
    const headers: Record<string, string> = init.body === undefined ? {} : { "Content-Type": "application/json" };

    let res: Response;
    try {
      res = await fetch(this.baseUrl + path, { ...init, headers });
    } catch (e: unknown) {
      // An aborted request is not an error to report: let the caller recognise it.
      if (e instanceof DOMException && e.name === "AbortError") throw e;
      throw new ApiError(0, "Network error");
    }

    if (!res.ok) throw new ApiError(res.status, await res.text());
    return (await res.json()) as T;
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { signal });
  }

  post<T, B>(path: string, body: B, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { method: "POST", body: JSON.stringify(body), signal });
  }
}
