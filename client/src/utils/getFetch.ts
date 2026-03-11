interface getFetchParams {
  key: string;
}

export default function getFetch(url: string, params?: getFetchParams) {
  const queryString = params
    ? Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join("&")
    : "";

  const fullUrl = queryString ? `${url}?${queryString}` : url;

  return fetch(fullUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).then((res) => res.json());
}
