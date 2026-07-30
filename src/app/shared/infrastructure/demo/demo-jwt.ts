interface DemoJwtPayload {
  sub: string;
  email: string;
  roles: string[];
  tenantId: string;
  exp: number;
}

function base64UrlEncode(value: string): string {
  const utf8Safe = encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
  return btoa(utf8Safe).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Builds a JWT-shaped (but unsigned) token for the demo session. Nothing server-side
 * ever verifies it — `IamStore.decodeJwtPayload` only base64-decodes the payload segment.
 */
export function buildDemoJwt(payload: DemoJwtPayload): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.demo-signature`;
}
