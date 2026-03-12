interface getFetchParams {
  key: string;
}

export default async function getFetch(url: string, params?: getFetchParams) {
  const queryString = params
    ? Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
        )
        .join("&")
    : "";

  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const res = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWFlMDJmMDQ5Y2I4NGQxMWZlZTA1NSIsImlhdCI6MTc3MzMxMzkyMywiZXhwIjoxNzczMzE3NTIzfQ.VTz9seTBbRgAwcbpssVGU9BfrzpG_LMiizWTsXYVsM4",
    },
    credentials: "include",
  });

  return res.json();
}
