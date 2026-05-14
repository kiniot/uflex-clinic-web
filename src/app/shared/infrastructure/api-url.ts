export function buildApiUrl(apiBaseUrl: string, endpointPath: string): string {
  const normalizedBaseUrl = apiBaseUrl.replace(/\/$/, '');
  const normalizedPath = endpointPath.replace(/^\/api\/v1(?=\/|$)/, '');
  return `${normalizedBaseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}
