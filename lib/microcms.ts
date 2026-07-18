export type MicroCmsNewsItem = {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  category?: { id: string; name: string } | null;
};

type MicroCmsListResponse = {
  contents: MicroCmsNewsItem[];
  totalCount: number;
};

export function hasMicroCmsConfig() {
  return Boolean(process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY);
}

export async function fetchMicroCmsNews(limit = 20): Promise<MicroCmsNewsItem[]> {
  const domain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!domain || !apiKey) {
    throw new Error("MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY is required.");
  }

  const response = await fetch(
    `https://${domain}.microcms.io/api/v1/news?orders=-publishedAt&limit=${limit}`,
    {
      headers: { "X-MICROCMS-API-KEY": apiKey },
      next: { revalidate: 60 },
    },
  );

  if (!response.ok) {
    throw new Error(`microCMS request failed: ${response.status}`);
  }

  const data = (await response.json()) as MicroCmsListResponse;
  return data.contents;
}
