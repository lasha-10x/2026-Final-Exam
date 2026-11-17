export type SortOption = "" | "price-asc" | "price-desc" | "rating-desc" | "title-asc";

export type ViewMode = "grid" | "list";

export interface CatalogParams {
  q: string;
  category: string;
  sort: SortOption;
  page: number;
}

export type Theme = "light" | "dark";
