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

export type ContactSubmission = {
  id: string;
  name: string | null;
  company: string | null;
  email: string;
  topic: string | null;
  message: string;
  status: string;
  created_at: string;
};

export type AnalyticsReport = {
  id: string;
  report_date: string;
  source: string;
  summary: Record<string, unknown>;
  channel_groups: Array<Record<string, unknown>>;
  search_queries: Array<Record<string, unknown>>;
  landing_pages: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  insights: string[];
  recommended_actions: string[];
  metadata: Record<string, unknown>;
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
      ...(method === "GET" ? { next: { revalidate: 300 } } : { cache: "no-store" as const }),
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
  return listExternalContents("youtube", limit);
}

export async function listNoteContents(limit = 24) {
  return listExternalContents("note", limit);
}

async function listExternalContents(source: ContentSource, limit: number) {
  if (!hasSupabaseReadConfig()) {
    return [];
  }

  const query = new URLSearchParams({
    source: `eq.${source}`,
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

export async function getLatestAnalyticsReport() {
  if (!hasSupabaseReadConfig()) {
    return null;
  }

  const query = new URLSearchParams({
    select:
      "id,report_date,source,summary,channel_groups,search_queries,landing_pages,events,insights,recommended_actions,metadata,created_at,updated_at",
    order: "report_date.desc",
    limit: "1",
  });

  try {
    const reports = await supabaseRequest<AnalyticsReport[]>("analytics_reports", {
      query: query.toString(),
    });

    return reports[0] ?? null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function insertContactSubmission(
  submission: Pick<ContactSubmission, "name" | "company" | "email" | "topic" | "message">,
) {
  const rows = await supabaseRequest<ContactSubmission[]>("contact_submissions", {
    method: "POST",
    body: submission,
    prefer: "return=representation",
    useServiceRole: true,
  });

  return rows[0];
}

export async function upsertAnalyticsReport(
  report: Pick<
    AnalyticsReport,
    | "report_date"
    | "source"
    | "summary"
    | "channel_groups"
    | "search_queries"
    | "landing_pages"
    | "events"
    | "insights"
    | "recommended_actions"
    | "metadata"
  >,
) {
  return supabaseRequest<AnalyticsReport[]>("analytics_reports", {
    method: "POST",
    query: "on_conflict=report_date",
    body: report,
    prefer: "resolution=merge-duplicates,return=representation",
    useServiceRole: true,
  });
}
