import { ogPages, ogSize, renderPageOg } from "@/lib/og/render";

export const runtime = "nodejs";
export const alt = ogPages.companies.alt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderPageOg("companies");
}
