import { joinUrl, toQueryString } from "./utils";

export type DataGoRequestOptions = {
  baseUrl: string;
  path: string;
  query: Record<string, string | number | undefined | null>;
  signal?: AbortSignal;
};

export async function fetchText({
  baseUrl,
  path,
  query,
  signal,
}: DataGoRequestOptions): Promise<string> {
  const qs = toQueryString(query);
  const url = qs ? `${joinUrl(baseUrl, path)}?${qs}` : joinUrl(baseUrl, path);

  const res = await fetch(url, {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.1",
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Data.go.kr request failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return text;
}

export async function fetchJson<T>(opts: DataGoRequestOptions): Promise<T> {
  const text = await fetchText(opts);
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new Error(
      `Failed to parse JSON response: ${(err as Error).message}. Body: ${text.slice(0, 200)}`,
    );
  }
}

