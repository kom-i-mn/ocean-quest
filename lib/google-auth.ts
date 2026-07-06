import { createSign } from "crypto";

type GoogleServiceAccount = {
  client_email?: string;
  private_key?: string;
  token_uri?: string;
};

const tokenCache = new Map<string, { accessToken: string; expiresAt: number }>();

export function hasGoogleAnalyticsConfig() {
  return Boolean(
    process.env.GA4_PROPERTY_ID &&
      process.env.SEARCH_CONSOLE_SITE_URL &&
      getGoogleClientEmail() &&
      getGooglePrivateKey(),
  );
}

export async function getGoogleAccessToken(scopes: string[]) {
  const now = Math.floor(Date.now() / 1000);
  const cacheKey = scopes.join(" ");
  const cached = tokenCache.get(cacheKey);

  if (cached && cached.expiresAt - 60 > now) {
    return cached.accessToken;
  }

  const clientEmail = getGoogleClientEmail();
  const privateKey = getGooglePrivateKey();
  const tokenUri = getGoogleTokenUri();

  if (!clientEmail || !privateKey) {
    throw new Error("Google service account credentials are not configured.");
  }

  const assertion = signJwt({
    iss: clientEmail,
    scope: scopes.join(" "),
    aud: tokenUri,
    exp: now + 3600,
    iat: now,
  }, privateKey);

  const response = await fetch(tokenUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Google OAuth token request failed: ${message}`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!data.access_token) {
    throw new Error("Google OAuth token response did not include access_token.");
  }

  tokenCache.set(cacheKey, {
    accessToken: data.access_token,
    expiresAt: now + (data.expires_in ?? 3600),
  });

  return data.access_token;
}

function signJwt(payload: Record<string, unknown>, privateKey: string) {
  const encodedHeader = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signer = createSign("RSA-SHA256");

  signer.update(unsignedToken);
  signer.end();

  return `${unsignedToken}.${base64UrlEncode(signer.sign(privateKey))}`;
}

function getServiceAccount() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!json) {
    return {};
  }

  try {
    return JSON.parse(json) as GoogleServiceAccount;
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }
}

function getGoogleClientEmail() {
  return process.env.GOOGLE_CLIENT_EMAIL ?? getServiceAccount().client_email;
}

function getGooglePrivateKey() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY ?? getServiceAccount().private_key;
  return privateKey?.replace(/\\n/g, "\n");
}

function getGoogleTokenUri() {
  return getServiceAccount().token_uri ?? "https://oauth2.googleapis.com/token";
}

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
