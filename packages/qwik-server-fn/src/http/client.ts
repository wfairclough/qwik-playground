const DEFAULT_API_URL = 'http://api.suitespot.link:8080';

export class HttpErrorResponse extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number,
    public readonly response: Response,
  ) {
    super(message);
    this.name = 'HttpErrorResponse';
    Object.setPrototypeOf(this, HttpErrorResponse.prototype);
  }
}

export interface HttpClientRequestInit extends RequestInit {
  body?: any;
  searchParams?: Record<string, string>;
}

export async function httpClient(endpoint: string, { body, searchParams, ...customReqInit }: HttpClientRequestInit = {}) {
  const headers = {'Content-Type': 'application/json'}
  const config: HttpClientRequestInit = {
    method: body ? 'POST' : 'GET',
    ...customReqInit,
    headers: {
      ...headers,
      ...customReqInit.headers,
    },
  }
  if (body) {
    config.body = JSON.stringify(body)
  }

  const uri = endpoint.startsWith('http') ? endpoint : `${process.env.API_URL ?? DEFAULT_API_URL}${endpoint}`;
  const url = new URL(uri);
  // console.log({ url, config });
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => url.searchParams.append(key, value));
  }
  const response = await fetch(url.toString(), config);
  if (response.ok) {
    return await response.json();
  } else {
    console.error('Error response', );
    if (response.headers.get('content-type')?.includes('application/json')) {
      const errorMessage = await response.json();
      const message = errorMessage.err ?? errorMessage?.error ?? errorMessage.message ?? await response.text();
      throw new HttpErrorResponse(message, response.status, response);
    }
    const errorMessage = await response.text()
    throw new HttpErrorResponse(errorMessage, response.status, response);
  }
}
