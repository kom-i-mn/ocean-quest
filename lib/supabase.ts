export type ContentSource = "youtube" | "note" | "ebook";
export type ContentStatus = "draft" | "review" | "published" | "archived";

export type ExternalContent = {
  id: string;
  source: ContentSource;
  source_id: string;
  source_url: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  status: ContentStatus;
  category: string | null;
  audience: string | null;
  metadata: Record<string, unknown>;
  source_content_id: string | null;
  created_at: string;
  updated_at: string;
};

type SupabaseRequestOptions = {
  method?: "GET" | "POST";
  query?: string;
  body?: unknown;
  prefer?: string;
  useServiceRole?: boolean;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseReadConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasSupabaseWriteConfig() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

export async function supabaseRequest<T>(
  table: string,
  {
    method = "GET",
    query = "",
    body,
    prefer,
    useServiceRole = false,
  }: SupabaseRequestOptions = {},
): Promise<T> {
  const apiKey = useServiceRole ? supabaseServiceRoleKey : supabaseAnonKey;

  if (!supabaseUrl || !apiKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/${table}${query ? `?${query}` : ""}`,
    {
      method,
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function listYouTubeContents(limit = 24) {
  if (!hasSupabaseReadConfig()) {
    return [];
  }

  const query = new URLSearchParams({
    source: "eq.youtube",
    status: "in.(draft,review,published)",
    select:
      "id,source,source_id,source_url,title,description,thumbnail_url,published_at,status,category,audience,metadata,source_content_id,created_at,updated_at",
    order: "published_at.desc.nullslast",
    limit: String(limit),
  });

  return supabaseRequest<ExternalContent[]>("external_contents", {
    query: query.toString(),
  });
}

export async function upsertExternalContents(
  contents: Array<
    Pick<
      ExternalContent,
      | "source"
      | "source_id"
      | "source_url"
      | "title"
      | "description"
      | "thumbnail_url"
      | "published_at"
      | "status"
      | "category"
      | "audience"
      | "metadata"
      | "source_content_id"
    >
  >,
) {
  if (contents.length === 0) {
    return [];
  }

  return supabaseRequest<ExternalContent[]>("external_contents", {
    method: "POST",
    query: "on_conflict=source,source_id",
    body: contents,
    prefer: "resolution=merge-duplicates,return=representation",
    useServiceRole: true,
  });
}
