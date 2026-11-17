import { PRODUCT_INDEX_PATH } from "@/api/endpoints";
import { useFetch } from "@/hooks/useFetch";
import { slugify } from "@/utils/slug";

interface IndexEntry {
  id: number;
  title: string;
}
interface IndexResponse {
  products: IndexEntry[];
}

export type ProductLookup = { status: "idle" | "loading" | "missing" } | { status: "found"; id: number } | { status: "error"; message: string };

let cachedIndex: IndexEntry[] | null = null; // the list is the same for the whole session: fetch it once

// Resolves a URL slug ("essence-mascara-lash-princess") to a product id. Pass null to skip.
export function useProductLookup(slug: string | null): ProductLookup {
  const { state } = useFetch<IndexResponse>(slug === null || cachedIndex !== null ? null : PRODUCT_INDEX_PATH);

  if (slug === null) return { status: "idle" };
  if (state.status === "success") cachedIndex = state.data.products;
  if (state.status === "error") return { status: "error", message: state.message };

  const index = cachedIndex;
  if (index === null) return { status: "loading" };
  const match = index.find((p) => slugify(p.title) === slug.toLowerCase());
  return match === undefined ? { status: "missing" } : { status: "found", id: match.id };
}
